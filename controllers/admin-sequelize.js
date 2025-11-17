import { Product } from "../models/product.js"


export const getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', { pageTitle: 'Add Product', path: "/admin/add-product", editing: false })

}

export const postAddProduct = async (req, res) => {

    try {

        const title = req.body.title
        const imageUrl = req.body.imageUrl
        const description = req.body.description
        const price = req.body.price
        await req.user.createProduct(
            {
                title,
                imageUrl,
                description,
                price
            }
        )
    } catch (err) {
        console.error(err)
    }
    res.redirect('/');
}

export const getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId

    try {
        const product = await Product.findByPk(prodId)
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
        console.log(err)
        res.redirect('/')
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await req.user.getProducts()

        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    } catch (err) {
        console.error(err);
    }
};


export const postEditProduct = async (req, res) => {

    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description
    const updatedPrice = req.body.price

    try {
        const product = await Product.findByPk(prodId);

        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        product.price = updatedPrice;

        await product.save();
        res.redirect('/admin/products')

    } catch (err) {
        console.error(err)
    }
}

export const deleteProduct = async (req, res) => {

    try {
        const prodId = req.body.productId
        await Product.destroy({
            where: { id: prodId }
        })
        res.redirect('/admin/products')
    } catch (err) {
        console.error(err)
    }
}