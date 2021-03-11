const Sequelize = require('sequelize');
const db = require('../config/db');

const Like = db.define('like', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  isUpVote: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Like;
