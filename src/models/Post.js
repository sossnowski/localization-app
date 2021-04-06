const Sequelize = require('sequelize');
const db = require('../config/db');
const Like = require('./Like');
const Comment = require('./Comment');
const Category = require('./Category');

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
});

Post.hasMany(Like, {
  onDelete: 'cascade',
});
Post.hasMany(Comment, {
  onDelete: 'cascade',
});
Post.belongsTo(Category);
Category.hasMany(Post);

module.exports = Post;
