import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./.env") });
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { validationResult } from 'express-validator';
import { User } from "../models/userMongo.js";

const API = process.env.API_KEY

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: API
        },
    })
)

export const getLogin = async (req, res) => {
    try {
        let message = req.flash('error');
        message = message.length > 0 ? message[0] : null;

        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: message,
            oldInput: { email: '', password: '' },
            validationErrors: [],
        });
    } catch (err) {
        console.error(err);
    }
};

export const getSignup = async (req, res) => {
    try {
        let message = req.flash('error');
        message = message.length > 0 ? message[0] : null;

        res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: message,
            oldInput: { email: '', password: '', confirmPassword: '' },
            validationErrors: [],
        });
    } catch (err) {
        console.error(err);
    }
};

export const postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password },
            validationErrors: errors.array()[0].msg,
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password.',
                oldInput: { email, password },
                validationErrors: [],
            });
        }

        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.userId = user._id;
            await req.session.save();
            return res.redirect('/');
        }

        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: { email, password },
            validationErrors: [],
        });
    } catch (err) {
        return next(err);
    }
};

export const postSignup = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    console.log(errors)
    console.log(req.body)

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password, confirmPassword },
            validationErrors: errors.array()[0].msg
        });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.flash('error', 'E-Mail exists already, please pick a different one.');
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        await user.save();
        console.log(user)
        await transporter.sendMail({
            to: email,
            from: 'Gabriel.bachelor@gmail.com',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>',
        });

        res.redirect('/login');
    } catch (err) {
        return next(err);
    }
};

export const postLogout = async (req, res) => {

    try {
        await req.session.destroy();
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
};

export const getReset = async (req, res) => {
    try {
        let message = req.flash('error');
        message = message.length > 0 ? message[0] : null;
        res.render('auth/reset', {
            path: '/reset',
            pageTitle: 'Reset Password',
            errorMessage: message,
        });
    } catch (err) {
        console.error(err);
    }
};

export const postReset = async (req, res, next) => {
    try {
        const buffer = await crypto.randomBytes(32);
        const token = buffer.toString('hex');

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        await transporter.sendMail({
            to: req.body.email,
            from: 'Gabriel.bachelor@gmail.com',
            subject: 'Password Reset',
            html: `<p>You requested a password reset</p>
             <p>Click the <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password.</p>`,
        });

        res.redirect('/');
    } catch (err) {
        return next(err);
    }
};

export const getNewPassword = async (req, res, next) => {
    const token = req.params.token;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if (!user) return res.redirect('/');

        let message = req.flash('error');
        message = message.length > 0 ? message[0] : null;

        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken: token,
        });
    } catch (err) {
        return next(err);
    }
};

export const postNewPassword = async (req, res, next) => {
    const { password: newPassword, userId, passwordToken } = req.body;
    try {
        const user = await User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId,
        });

        if (!user) return res.redirect('/login');

        user.password = await bcrypt.hash(newPassword, 12);
        user.resetToken = null;
        user.resetTokenExpiration = undefined;

        await user.save();
        res.redirect('/login');
    } catch (err) {
        return next(err);
    }
};