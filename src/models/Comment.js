const Sequelize = require('sequelize');
const db = require('../config/db');
const Like = require('./Like');

const Comment = db.define('comment', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

Comment.hasMany(Like);

module.exports = Comment;
