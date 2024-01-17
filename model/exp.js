const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Exp = sequelize.define('exp',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,

    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
            type: Sequelize.STRING,
            allowNull: false
    }
});

module.exports = Exp;