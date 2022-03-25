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
  likesNumber: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
  },
  dislikesNumber: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Comment.hasMany(Like, {
  onDelete: 'CASCADE',
});
Like.belongsTo(Comment);

module.exports = Comment;

Comment.afterCreate(async (comment, options) => {
  comment.setPost({ commentNumber: Sequelize.literal('commentNumber + 1') });
});
