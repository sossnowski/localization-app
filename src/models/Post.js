const Sequelize = require('sequelize');
const db = require('../config/db');
const Like = require('./Like');
const Comment = require('./Comment');
const Photo = require('./Photo');

const Post = db.define(
  'post',
  {
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
    likesNumber: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
    dislikesNumber: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentNumber: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['createdAt'] }],
  }
);

Post.hasMany(Like, {
  onDelete: 'cascade',
});
Like.belongsTo(Post);
Post.hasMany(Comment, {
  onDelete: 'cascade',
});
Comment.belongsTo(Post);
Post.hasMany(Photo, {
  onDelete: 'cascade',
});

module.exports = Post;
