import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./.env") });
import { Sequelize } from "sequelize";
import fs from "fs";

const caPath = path.resolve(process.env.DB_CA_PATH);


export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: console.log,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(caPath).toString(),
        },
    },

})
