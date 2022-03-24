const Sequelize = require('sequelize');
const db = require('../config/db');

const Notification2 = db.define(
  'notification2',
  {
    uid: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    indexes: [{ fields: ['text'] }],
  }
);

module.exports = Notification2;
