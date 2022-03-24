const Sequelize = require('sequelize');
const db = require('../config/db');

const Notification = db.define(
  'notification',
  {
    uid: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    number: {
      type: Sequelize.DataTypes.NUMBER,
      default: 1,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    new: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    indexes: [{ fields: ['updatedAt'] }],
  }
);

module.exports = Notification;
