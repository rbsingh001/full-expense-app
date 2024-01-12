const Sequelize = require('sequelize');

const sequelize = new Sequelize('expence', 'root','rbsingh@123', {
    dialect: 'mysql',
    host: 'localhost'
});


module.exports = sequelize;