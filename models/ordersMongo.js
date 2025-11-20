import mongoose from "mongoose";
import { Schema } from "mongoose";


const orderSchema = new mongoose.Schema({


    items: [{
        productData: { type: Object, required: true },
        quantity: { type: Number, required: true }
    }],

    user: {
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        email: { type: String, required: true }
    },



}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)



// import { getDb } from "../util/db.js";

// export const getOrders = () => {
//     const db = getDb();
//     return db.collection("orders")
// }