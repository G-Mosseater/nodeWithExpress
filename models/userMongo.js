import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Order } from "./ordersMongo.js";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId, ref:
                    'Product', required: true
            }, quantity: { type: Number, required: true }
        }]
    }

})


userSchema.methods.addToCart = async function (product) {

    this.cart = this.cart || { items: [] }
    const cartItems = this.cart.items
    const existingIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString())

    if (existingIndex >= 0) {
        cartItems[existingIndex].quantity += 1
    } else {
        cartItems.push({
            productId: product._id,
            quantity: 1
        })
    }

    this.cart.items = cartItems

    await this.save()
    return this.cart.items

}

userSchema.methods.removeFromCart = async function (productId) {
    this.cart.items = this.cart.items.filter(
        item => {
            const id = item.productId._id ? item.productId._id.toString() : item.productId.toString();
            return id !== productId.toString();
        }
    )
    await this.save()

    return this.cart.items
}


userSchema.methods.createOrder = async function () {

    await this.populate("cart.items.productId")

    const orderItems = this.cart.items.map(item => ({
        productData: {
            ...item.productId._doc
        },
        quantity: item.quantity
    }))

    const Order = mongoose.model("Order")
    const order = new Order({
        items: orderItems,
        user: {
            email: this.email,
            userId: this._id
        }
    })

    await order.save()
    this.cart.items = []

    await this.save()
    return order
}


export const User = mongoose.model("User", userSchema)



// import { ObjectId } from "mongodb";
// import { getDb } from "../util/db.js";

// export function getUsers() {
//     const db = getDb()
//     return db.collection("users")
// }

// export async function createUser({ name, email }) {
//     const users = getUsers()
//     const result = await users.insertOne({
//         name, email, createdAt: new Date(), cart: { items: [] }
//     })
//     return result.insertedId
// }


// export async function findUserById(id) {
//     if (!ObjectId.isValid(id)) {
//         return null
//     }
//     const users = getUsers()
//     return users.findOne({ _id: new ObjectId(id) })
// }

// export async function addToCart(userId, product) {
//     if (!product || !product._id) {
//         throw new Error("Invalid product");
//     }

//     const users = getUsers()
//     const user = await users.findOne({ _id: new ObjectId(userId) })
//     if (!user) {
//         throw new Error("User not found")
//     }

//     user.cart = user.cart || { items: [] };
//     const cartItems = user.cart.items
//     const existingItemIndex = cartItems.findIndex(item => item.productId.toString() === product._id.toString())
//     if (existingItemIndex >= 0) {
//         cartItems[existingItemIndex].quantity += 1
//     }
//     else {
//         cartItems.push({
//             productId: new ObjectId(product._id),
//             quantity: 1
//         })
//     }
//     await users.updateOne(
//         { _id: new ObjectId(userId) },
//         { $set: { "cart.items": cartItems } }
//     )
//     return cartItems

// }


// export const removeFromCart = async (userId, productId) => {

//     try {
//         const users = getUsers()
//         await users.updateOne(
//             { _id: new ObjectId(userId) },
//             {
//                 $pull: { "cart.items": { productId: new ObjectId(productId.toString()) } }
//             }
//         )
//     }
//     catch (err) {
//         console.error(err)
//     }


// }