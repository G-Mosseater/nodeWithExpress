import mongoose from "mongoose";
import { fetchProductById, Product } from "../models/productMongo.js";
import { findAllProducts } from '../models/productMongo.js'


export const postAddProduct = async (req, res) => {
    const { title, price, imageUrl, description } = req.body
    try {
        const product = new Product({
            title,
            price: parseFloat(price),
            imageUrl,
            description,
            userId: req.user._id
        })

        await product.save()
        res.redirect('/admin/products')
    } catch (err) {
        console.error(err)
    }
}


export const getAddProduct = async (req, res) => {


    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,

    });
}


export const getProducts = async (req, res) => {

    try {
        const userId = req.user._id;

        const products = await Product.find({ userId: userId })
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',


        });
        console.log(products)
    } catch (err) {
        console.error(err)
    }
}

export const getEditProduct = async (req, res) => {

    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect("/")
    }

    try {
        const prodId = req.params.productId
        const product = await fetchProductById(prodId)
        if (!prodId) {
            return res.redirect("/")
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,


        })
    }
    catch (err) {
        console.error(err)
    }


}

export const postEditProduct = async (req, res) => {

    const prodId = req.body.productId
    if (!mongoose.Types.ObjectId.isValid(prodId)) {
        return res.status(400).send("Invalid product ID")
    }
    const updatedData = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        imageUrl: req.body.imageUrl,
        description: req.body.description
    }

    try {
        const product = await Product.findById(prodId)
        if (!product) {
            console.log("Product not found.");
            return res.redirect("/admin/products");
        }

        if (product.userId.toString() !== req.user._id.toString()) {
            console.log('Unauthorized attempt!')
            return res.redirect('/admin/products')
        }

        product.title = updatedData.title
        product.price = updatedData.price
        product.imageUrl = updatedData.imageUrl
        product.description = updatedData.description

        await product.save()
        res.redirect("/admin/products")

    }
    catch (err) {
        console.error(err)
        res.redirect("/admin/products")
    }
}


export const postDeleteProduct = async (req, res) => {
    const prodId = req.body.productId

    if (!prodId || !mongoose.Types.ObjectId.isValid(prodId)) {
        return res.status(400).send("Invalid product ID")
    }
    try {

        const product = await Product.findById(prodId)

        if (!product) {
            console.log('No product found');
            return res.redirect("/admin/products")
        }

        if (product.userId.toString() !== req.user._id.toString()) {
            console.log("Unauthorized access")
            return res.redirect('/admin/products')
        }

        await Product.findByIdAndDelete(prodId)

        res.redirect("/admin/products")
    }
    catch (err) {
        console.error(err)
    }
}



// export const postAddProduct = async (req, res) => {

//     const { title, price, imageUrl, description } = req.body
//     const userId = req.user._id;
//     try {
//         await createProduct({ title, price, imageUrl, description, userId })
//         res.redirect("/admin/products")

//     }
//     catch (err) {
//         console.error(err)
//     }
// }

// export const getAddProduct = async (req, res) => {
//     res.render("admin/edit-product", {
//         pageTitle: "Add Product",
//         path: "/admin/add-product",
//         editing: false
//     });
// }

// export const getProducts = async (req, res) => {

//     try {
//         const products = await findAllProducts()
//         res.render('admin/products', {
//             prods: products,
//             pageTitle: 'Admin Products',
//             path: '/admin/products'
//         });

//     }
//     catch (err) {
//         console.error(err)
//     }


// }


// export const getEditProduct = async (req, res) => {

//     const editMode = req.query.edit
//     if (!editMode) {
//         return res.redirect('/')
//     }
//     try {
//         const prodId = req.params.productId
//         const product = await fetchProductById(prodId)
//         if (!product) {
//             return res.redirect('/')
//         }
//         res.render('admin/edit-product', {
//             pageTitle: 'Edit Product',
//             path: '/admin/edit-product',
//             editing: editMode,
//             product: product
//         })
//     } catch (err) {
//         console.error(err)
//     }

// }

// export const postEditProduct = async (req, res) => {
//     const prodId = req.body.productId
//     const updatedData = {
//         title: req.body.title,
//         price: parseFloat(req.body.price),
//         imageUrl: req.body.imageUrl,
//         description: req.body.description
//     }
//     try {
//         const modifiedCount = await updateProduct(prodId, updatedData);
//         if (modifiedCount === 0) {
//             console.log("No changes made.");
//         }
//         res.redirect('/admin/products');
//     } catch (err) {
//         console.error(err);
//     }
// }


// export const postDeleteProduct = async (req, res) => {

//     const prodId = req.body.productId
//     try {
//         const deleteCount = await deleteProduct(prodId)
//         if (deleteCount === 0) {
//             console.log('No products deleted')
//         }
//         res.redirect('/admin/products')
//     }
//     catch (err) {
//         console.error(err)
//     }




// }