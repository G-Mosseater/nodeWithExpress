import { Sequelize } from "sequelize";
import { sequelize } from "../util/db.js";



export const Cart = sequelize.define('cart', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
})