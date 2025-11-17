import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./.env") });
import { MongoClient } from "mongodb";
import mongoose from "mongoose";


const uri = process.env.MONGODB_URI


export async function connectDb() {
    try {
        await mongoose.connect(uri)
    }
    catch (err) {
    }
}


// const client = new MongoClient(uri)
// let db
// export async function connectMongo() {

//     try {
//         await client.connect()
//         console.log("Connected to MongoDB")
//         db = client.db('shop')
//         return db
//     } catch (err) {
//         console.error("failed to connect", err)
//         process.exit(1)
//     }
// }


// export function getDb() {
//     if (!db) {
//         throw new Error("Database not connected")
//     }
//     return db
// }





// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.resolve("./.env") });
// import { Sequelize } from "sequelize";
// import fs from "fs";

// const caPath = path.resolve(process.env.DB_CA_PATH);


// export const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD, {

//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql",
//     logging: console.log,
//     dialectOptions: {
//         ssl: {
//             ca: fs.readFileSync(caPath).toString(),
//         },
//     },

// })
