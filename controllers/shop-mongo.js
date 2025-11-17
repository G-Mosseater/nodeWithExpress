import { fetchProductById, Product } from "../models/productMongo.js";
import mongoose from "mongoose";
import { Order } from "../models/ordersMongo.js";
export const getIndex = async (req, res) => {
    try {
        const products = await Product.find()
        res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' })

    } catch (err) {
        console.error(err)
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.render('shop/product-list', { prods: products, pageTitle: 'Products', path: '/products' })

    } catch (err) {
        console.error(err)
    }
}



export const getProduct = async (req, res) => {

    try {
        const prodId = req.params.productId
        if (!mongoose.Types.ObjectId.isValid(prodId)) {
            return res.status(400).send("Invalid product ID");
        }
        const product = await Product.findById(prodId)
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products'
        });
    }
    catch (err) {
        console.error(err)
    }

}

export const postAddToCart = async (req, res) => {

    try {
        const prodId = req.body.productId
        const product = await fetchProductById(prodId)
        await req.user.addToCart(product)
        res.redirect("/")

    }
    catch (err) {
        console.error(err)
    }
}


export const getCart = async (req, res) => {

    try {

        await req.user.populate('cart.items.productId')

        const cartProducts = req.user.cart.items.map(
            item => ({
                product: item.productId,
                quantity: item.quantity
            })
        )

        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            cartProducts
        });
    } catch (err) {
        console.error(err)
    }
}

export const postDeleteCartItem = async (req, res) => {
    try {
        const productId = req.body.productId
        const updatedCart = await req.user.removeFromCart(productId)
        res.redirect('/cart')
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error removing item from cart' });
    }
}

export const postOrder = async (req, res) => {

    try {
        await req.user.createOrder()
        res.redirect('/orders')
    } catch (err) {
        console.error(err)
    }
}

export const getAllOrders = async (req, res) => {
    try {

        const userId = req.user._id
        const orders = await Order.find({ "user.userId": userId }).sort({ createdAt: -1 })
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    } catch (err) {
        console.error(err)
    }
}

// Without mongoose //

// import { getOrders } from "../models/ordersMongo.js";
// import { findAllProducts, fetchProductById } from "../models/productMongo.js";
// import { addToCart, getUsers, removeFromCart } from "../models/userMongo.js";
// import { ObjectId } from "mongodb";


// export const getIndex = async (req, res) => {
//     try {
//         const products = await findAllProducts()
//         res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' })

//     }
//     catch (err) {
//         console.error(err)
//     }
// }

// export const getProducts = async (req, res) => {

//     try {
//         const products = await findAllProducts()

//         res.render('shop/product-list', { prods: products, pageTitle: 'Products', path: '/products' })

//     } catch (err) {
//         console.error(err)
//     }
// }



// export const getProduct = async (req, res) => {

//     try {
//         const prodId = req.params.productId
//         const product = await fetchProductById(prodId);
//         if (!product) {
//             return res.status(404).send("Product not found");
//         }
//         res.render('shop/product-detail', {
//             product,
//             pageTitle: product.title,
//             path: '/products'
//         });

//     } catch (err) {
//         console.error(err)
//     }
// }

// export const postAddToCart = async (req, res) => {

//     try {
//         const prodId = req.body.productId

//         const userId = req.user._id
//         const product = await fetchProductById(prodId)
//         await addToCart(userId, product)
//         res.redirect("/")
//     }
//     catch (err) {
//         console.error(err)
//     }
// }


// export const getCart = async (req, res) => {

//     try {
//         const userId = req.user._id
//         const users = getUsers()
//         const result = await users.aggregate([
//             { $match: { _id: new ObjectId(userId) } },
//             {
//                 $lookup: {
//                     from: "products",
//                     localField: "cart.items.productId",
//                     foreignField: "_id",
//                     as: "productDetails"
//                 }
//             }
//         ]).toArray()
//         const user = result[0]

//         const cart = user.cart.items.map(item => {
//             const product = user.productDetails.find(
//                 p => p._id.toString() === item.productId.toString()
//             )
//             return {
//                 ...item, product
//             }
//         })
//         console.log(cart)
//         res.render("shop/cart", {
//             path: "/cart",
//             pageTitle: "Your Cart",
//             cartProducts: cart
//         })
//     } catch (err) {
//         console.error(err)
//     }
// }


// export const postDeleteCartItem = async (req, res) => {

//     try {
//         const productId = req.body.productId
//         const userId = req.user._id
//         await removeFromCart(userId, productId)
//         res.redirect('/cart')
//     } catch (err) {
//         console.error(err)
//     }
// }


// export const postOrder = async (req, res) => {
//     try {
//         const users = getUsers()
//         const orders = getOrders()

//         const userId = req.user._id

//         const result = await users.aggregate([
//             { $match: { _id: new ObjectId(userId) } },
//             {

//                 $lookup: {
//                     from: "products",
//                     localField: "cart.items.productId",
//                     foreignField: "_id",
//                     as: "productDetails"
//                 }

//             }
//         ]).toArray()


//         const user = result[0]


//         const cartItems = user.cart.items.map(item => {
//             const product = user.productDetails.find(
//                 p => p._id.toString() === item.productId.toString()
//             )
//             return {
//                 productId: item.productId,
//                 quantity: item.quantity,
//                 title: product.title,
//                 price: product.price
//             }
//         })

//         const order = {
//             userId: new ObjectId(userId),
//             name: user.name,
//             email: user.email,
//             items: cartItems,
//             createdAt: new Date()
//         }
//         await orders.insertOne(order)

//         await users.updateOne({

//             _id: new ObjectId(userId)
//         },
//             { $set: { "cart.items": [] } }
//         )

//         res.redirect('/orders')
//     }
//     catch (err) {
//         console.error(err)
//     }
// }


// export const getAllOrders = async (req, res) => {
//     try {
//         const allOrders = getOrders()
//         const userId = req.user._id
//         const orders = await allOrders.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray()

//         res.render('shop/orders', { path: '/orders', pageTitle: 'Your Orders', orders: orders })

//     } catch (err) {

//         console.error(err)
//     }
// }