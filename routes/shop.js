import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { getAllOrders, postOrder, postDeleteCartItem, getIndex, getProducts, getProduct, postAddToCart, getCart } from "../controllers/shop-mongo.js";
// import { getProducts, getIndex, getProduct, postAddToCart, getCart, postDeleteCartItem, postOrder, getAllOrders } from "../controllers/shop-mongo.js"
// // import { deleteCartProduct, getCart, getCheckout, getIndex, getOrders, getProduct, getProducts, postCart, postOrder } from "../controllers/shop.js";
// // import path from 'path'
// // // import { fileURLToPath } from "url";

export const router = express.Router()

// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);


router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/products/:productId', getProduct)

router.get('/cart', isAuth, getCart)

router.post('/cart', isAuth, postAddToCart)

router.post('/cart-delete-item', isAuth, postDeleteCartItem)

router.get('/orders', isAuth, getAllOrders)

router.post('/create-order', isAuth, postOrder)

// // router.get('/checkout', getCheckout)


