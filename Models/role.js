const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const role = sequelize.define("Role", {
    roleName : {
        type : DataTypes.STRING,
        allowNull : false
    }
})

module.exports = role;