const Sequelize = require('sequelize');
const db = require('../config/db');

const Photo = db.define('photo', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  filename: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Photo;
