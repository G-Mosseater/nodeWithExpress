import mongoose from "mongoose";
import { Schema } from "mongoose";


const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})



export const Product = mongoose.model("Product", productSchema)



export async function findAllProducts() {
    return await Product.find().lean()
}

export async function fetchProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null
    }
    return await Product.findById(id)
}









// import { getDb } from "../util/db.js";
// import { ObjectId } from "mongodb";


// export function getProducts() {
//     return getDb().collection("products")
// }


// export async function createProduct({ title, price, imageUrl, description, userId }) {

//     const products = getProducts()

//     const result = await products.insertOne({

//         title,
//         price: parseFloat(price),
//         imageUrl,
//         description,
//         createdAt: new Date(),
//         userId

//     })
//     return result.insertedId
// }

// export async function findAllProducts() {
//     const products = getProducts()
//     const allProducts = await products.find().toArray()
//     return allProducts
// }


// export async function fetchProductById(id) {

//     if (!ObjectId.isValid(id)) {
//         return null;
//     }
//     const products = getProducts()
//     const product = await products.findOne({ _id: new ObjectId(id) })
//     return product
// }

// export async function updateProduct(id, data) {
//     const products = getProducts()

//     if (!ObjectId.isValid(id)) {
//         throw new Error("Invalid product ID")
//     }
//     const result = await products.updateOne(
//         { _id: new ObjectId(id) },
//         {
//             $set: {
//                 ...data,
//                 updatedAt: new Date()
//             }
//         }
//     )

//     return result.modifiedCount
// }

// export async function deleteProduct(id) {

//     const products = getProducts()

//     if (!ObjectId.isValid(id)) {
//         throw new Error("Invalid product ID");
//     }
//     const result = await products.deleteOne({ _id: new ObjectId(id) })

//     return result.deletedCount;

// }