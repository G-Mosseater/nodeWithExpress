import { Product } from "../models/product.js"
// import findById from '../models/product.js'

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll()
        res.render('shop/product-list', { prods: products, pageTitle: 'Products', path: '/products' })

    } catch (err) {
        console.error(err)
    }

}
export const getProduct = async (req, res) => {
    try {
        const prodId = req.params.productId;

        const product = await Product.findByPk(prodId);

        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products'
        });
    } catch (err) {
        console.error(err);
    }
};

export const getIndex = async (req, res) => {

    try {
        const products = await Product.findAll()
        res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' })

    } catch (err) {
        console.error(err)
    }
}


export const getCart = async (req, res) => {
    try {
        const cart = await req.user.getCart()
        if (!cart) {
            cart = await req.user.createCart();
        }

        const cartProducts = await cart.getProducts();
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts,
            totalPrice: cart.totalPrice,
            cartProducts
        }
        )
    } catch (err) {

        console.error(err)
    }
}



export const postCart = async (req, res) => {
    try {
        const prodId = req.body.id

        const cart = await req.user.getCart()

        const products = await cart.getProducts({ where: { id: prodId } })

        let product
        let newQuantity = 1

        if (products.length > 0) {
            product = products[0]
            newQuantity = product.cartItem.quantity + 1
        }
        else {
            product = await Product.findByPk(prodId)
        }

        await cart.addProduct(product, { through: { quantity: newQuantity } })

        res.redirect('/cart')
    }
    catch (err) {

        console.error(err)

    }
}
export const deleteCartProduct = async (req, res) => {
    const prodId = req.body.productId

    try {
        const cart = await req.user.getCart()
        const products = await cart.getProducts({ where: { id: prodId } })
        const product = products[0]
        await product.cartItem.destroy()

        res.redirect('/cart')
    }
    catch (err) {
        console.error(err)
    }
}

export const getCheckout = async (res, req) => {

    res.render('/shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })

}

export const getOrders = async (req, res) => {

    let orders
    try {
        orders = await req.user.getOrders({ include: [Product] })
    }
    catch (err) {
        console.error(err)
    }

    res.render('shop/orders', { path: '/orders', pageTitle: 'Your Orders', orders: orders })
}

export const postOrder = async (req, res) => {

    try {
        let cart = await req.user.getCart()
        if (!cart) {
            cart = await req.user.createCart();
        }
        const products = await cart.getProducts();
        const order = await req.user.createOrder()
        await order.addProducts(products.map(
            product => {
                product.orderItem = { quantity: product.cartItem.quantity }
                return product
            }
        ))
        await cart.setProducts([]);
        res.redirect('/orders')
    }
    catch (err) {
        console.log(err)
    }
}