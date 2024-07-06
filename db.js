const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Conversation = sequelize.define('Conversation', {
    userMessage: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    botMessage: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

sequelize.sync();

module.exports = { sequelize, Conversation };
