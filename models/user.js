import { Sequelize } from "sequelize";
import { sequelize } from "../util/db.js";



export const User = sequelize.define('user', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
})