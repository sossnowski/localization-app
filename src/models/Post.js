const Sequelize = require('sequelize');
const db = require('../config/db');
const Like = require('./Like');
const Comment = require('./Comment');

const Post = db.define('post', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  localization: {
    type: Sequelize.DataTypes.GEOMETRY('POINT'),
    allowNull: false,
  },
});

Post.hasMany(Like);
Post.hasMany(Comment);

module.exports = Post;
