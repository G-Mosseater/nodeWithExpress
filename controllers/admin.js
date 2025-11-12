import Product from "../models/product.js"


export const getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', { pageTitle: 'Add Product', path: "/admin/add-product", editing: false })

}

export const postAddProduct = async (req, res) => {

    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const price = req.body.price

    const product = new Product(null, title, imageUrl, description, price)
    await product.save()

    res.redirect('/');

}

export const getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }

    const prodId = req.params.productId

    try {
        const product = await Product.findById(prodId)
        if (!product) {
            return res.redirect('/')
        }

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        })
    } catch (err) {
        console.log('Error fetching product:', err)
        res.redirect('/')
    }
}

export const getProducts = async (req, res) => {
    const products = await Product.fetchAll()
    res.render('admin/products', { prods: products, pageTitle: 'Admin products', path: '/admin/products' })

}



export const postEditProduct = async (req, res) => {

    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description
    const updatedPrice = req.body.price


    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice
    )
    await updatedProduct.save()

    res.redirect('/admin/products')

}

export const deleteProduct = async(req,res) => {

    const prodId = req.body.productId
    Product.deleteById(prodId)
    res.redirect('/admin/products')

}