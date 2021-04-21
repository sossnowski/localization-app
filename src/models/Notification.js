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
    },
    isUpVote: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['createdAt'] }],
  }
);

module.exports = Notification;
