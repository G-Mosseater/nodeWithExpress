import express from "express";
// // import { deleteProduct, getAddProduct, getEditProduct, getProducts, postAddProduct, postEditProduct } from "../controllers/admin.js";
// import { postAddProduct, getAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct } from "../controllers/admin-mongo.js";
import { postDeleteProduct, postAddProduct, getAddProduct, getProducts, getEditProduct, postEditProduct } from "../controllers/admin-mongo.js"

export const router = express.Router()

router.get('/add-product', getAddProduct)

router.get('/products', getProducts)

router.post('/add-product', postAddProduct)

router.get('/edit-product/:productId', getEditProduct)

router.post('/edit-product', postEditProduct)

router.post('/delete-product', postDeleteProduct)