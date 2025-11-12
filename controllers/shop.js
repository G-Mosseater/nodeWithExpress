import Product from "../models/product.js"
import findById from '../models/product.js'
import Cart from "../models/cart.js"


export const getProducts = async (req, res) => {
    const products = await Product.fetchAll()
    res.render('shop/product-list', { prods: products, pageTitle: 'All Products', path: '/products' })

}
export const getProduct = async (req, res) => {


    const prodId = req.params.productId
    const product = await Product.findById(prodId)
    res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' })

}

export const getIndex = async (req, res) => {

    const products = await Product.fetchAll()
    res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' })

}


export const getCart = async (req, res) => {
    try {
        const products = await Product.fetchAll()
        const cart = await Cart.getCart()
        const cartProducts = products.map(prod => {
            const item = cart.products.find(p => p.id === prod.id)
              if (!item) return null;
            if (item) return { ...prod, qty: item.qty }
        }).filter(p => p !== null);
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts,
            totalPrice: cart.totalPrice,
            cartProducts
        })
    } catch (err) {
        console.error(err)
    }
}

export const postCart = async (req, res) => {
    const prodId = req.body.id
    try {
        const product = await Product.findById(prodId)
        if (!product) {
            return res.status(404).send('Product not found')
        }
        await Cart.addProduct(prodId, product.price)
        res.redirect('/cart')

    } catch (err) {
        console.error('Error adding product to cart:', err)
        res.status(500).send('Something went wrong')

    }
}
export const deleteCartProduct = async (req, res) => {
    const prodId = req.body.productId

    try {
        const product = await Product.findById(prodId)
        if (!product) {
            return res.status(404).send('Product not found')
        }

        await Cart.deleteProduct(prodId, product.price)
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
    res.render('shop/orders', { path: '/orders', pageTitle: 'Your Orders' })
}



