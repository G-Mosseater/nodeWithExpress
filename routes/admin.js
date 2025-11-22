import express from "express";
// // import { deleteProduct, getAddProduct, getEditProduct, getProducts, postAddProduct, postEditProduct } from "../controllers/admin.js";
// import { postAddProduct, getAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct } from "../controllers/admin-mongo.js";
import { postDeleteProduct, postAddProduct, getAddProduct, getProducts, getEditProduct, postEditProduct } from "../controllers/admin-mongo.js"
import { isAuth } from "../middleware/isAuth.js";
import { check } from "express-validator";


export const router = express.Router()

router.get('/add-product', isAuth, getAddProduct)

router.get('/products', isAuth, getProducts)

router.post('/add-product', isAuth,
    [
        check('title')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Title must be at least 3 characters long.'),
        check('price')
            .isFloat({ min: 0.01 })
            .withMessage('Please enter a valid price.'),

        check('description')
            .trim()
            .isLength({ min: 5 })
            .withMessage('Description must be at least 5 characters long.')
    ], postAddProduct)

router.get('/edit-product/:productId', isAuth, getEditProduct)

router.post('/edit-product', isAuth, postEditProduct)

router.post('/delete-product', isAuth, postDeleteProduct)