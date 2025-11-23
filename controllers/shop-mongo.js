import { fetchProductById, Product } from "../models/productMongo.js";
import mongoose from "mongoose";
import { Order } from "../models/ordersMongo.js";
import { User } from "../models/userMongo.js";
import fs from 'fs'
import path from "path";
import PDFDocument from "pdfkit";



export const getIndex = async (req, res) => {
    try {
        const products = await Product.find()
        res.render('shop/index', {
            prods: products, pageTitle: 'Shop', path: '/',
            csrfToken: req.csrfToken()
        })

    } catch (err) {
        console.error(err)
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.render('shop/product-list', {
            prods: products, pageTitle: 'Products', path: '/products'
        })

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
            path: '/products', isAuthenticated: !!req.user



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
        const user = await User.findById(req.session.userId).populate('cart.items.productId')
        if (!user) return res.redirect("/login")

        const cartProducts = user.cart.items.map(
            item => ({
                product: item.productId,
                quantity: item.quantity
            })
        ).filter(item => item.product)

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
        const user = await User.findById(req.session.userId);
        if (!user) return res.redirect("/login")
        await user.createOrder()
        res.redirect('/orders')
    } catch (err) {
        console.error(err)
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.redirect("/login")

        const orders = await Order.find({ "user.userId": user._id }).sort({ createdAt: -1 })
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    } catch (err) {
        console.error(err)
    }
}

export const getInvoice = async (req, res, next) => {

    const orderId = req.params.orderId

    try {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error('Order not found')
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {

            next(new Error('Unauthorized access'))
            return res.redirect('/orders')
        }
        const invoiceName = 'invoice-' + orderId + '.pdf'
        const invoicePath = path.join('data', 'invoices', invoiceName)
        const pdfDoc = new PDFDocument()
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res)

        pdfDoc.fontSize(26).text('Orders', {
            underline: true
        })
        pdfDoc.text('----------------------------')
        order.items.forEach(item => {

            pdfDoc.text(`${item.productData.title} - ${item.quantity} x $${item.productData.price}`)
        })
        pdfDoc.end()

        // fs.readFile(invoicePath, (err, data) => {
        //     if (err) {
        //         return next(err)
        //     }
        //     res.setHeader('Content-Type', 'application/pdf')
        //     res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)
        //     res.send(data)
        // })

        // For large files
        // const file = fs.createReadStream(invoicePath)
        // res.setHeader('Content-Type', 'application/pdf')
        // res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)
        // file.pipe(res)
    }
    catch (err) {
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