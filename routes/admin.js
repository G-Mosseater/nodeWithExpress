import express from "express";
// // import { deleteProduct, getAddProduct, getEditProduct, getProducts, postAddProduct, postEditProduct } from "../controllers/admin.js";
// import { postAddProduct, getAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct } from "../controllers/admin-mongo.js";
import { postDeleteProduct, postAddProduct, getAddProduct, getProducts, getEditProduct, postEditProduct } from "../controllers/admin-mongo.js"
import { isAuth } from "../middleware/isAuth.js";

export const router = express.Router()

router.get('/add-product', isAuth, getAddProduct)

router.get('/products', isAuth, getProducts)

router.post('/add-product', isAuth, postAddProduct)

router.get('/edit-product/:productId', isAuth, getEditProduct)

router.post('/edit-product', isAuth, postEditProduct)

router.post('/delete-product', isAuth, postDeleteProduct)