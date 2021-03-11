const Sequelize = require('sequelize');
const db = require('../config/db');
const Post = require('./Post');

const Category = db.define('category', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  confirmed: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Category;
