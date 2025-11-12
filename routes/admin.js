import express from "express";
import { deleteProduct, getAddProduct, getEditProduct, getProducts, postAddProduct, postEditProduct } from "../controllers/admin.js";

export const router = express.Router()


router.get('/add-product', getAddProduct)


router.get('/products', getProducts)


router.post('/add-product', postAddProduct)


router.get('/edit-product/:productId', getEditProduct)


router.post('/edit-product', postEditProduct)

router.post('/delete-product', deleteProduct)