import express from "express";
import { getLogin, postLogin, postLogout, postSignup, getSignup, getReset, postReset, passwordReset, postNewPassword } from "../controllers/auth.js";


export const router = express.Router()

router.get('/login', getLogin)

router.get('/signup', getSignup)

router.post('/login', postLogin)

router.post('/logout', postLogout)

router.post('/signup', postSignup)

router.get("/reset", getReset)

router.post("/reset", postReset)

router.get("/reset/:token", passwordReset)

router.post('/password', postNewPassword)