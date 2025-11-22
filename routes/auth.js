import express from "express";
import { getLogin, postLogin, postLogout, postSignup, getSignup, getReset, postReset, getNewPassword, postNewPassword } from "../controllers/auth.js"
import { check } from "express-validator";
import { User } from "../models/userMongo.js";
export const router = express.Router()

router.get('/login', getLogin)

router.get('/signup', getSignup)

router.post(
    '/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.'),
        check('password', 'Password is not valid.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
    ],
    postLogin
);
router.post('/logout', postLogout)

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom(async (value) => {
            const user = await User.findOne({ email: value })

            if (user) {
                throw new Error('E-Mail exists already, please pick a different one.')
            }

            return true
        }),

    check(
        'password',
        'Please enter a password with only letters and numbers and at least 5 characters.'
    )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
        .trim(),
], postSignup)

router.get("/reset", getReset)

router.post("/reset", postReset)

router.get("/reset/:token", getNewPassword)

router.post('/password', postNewPassword)