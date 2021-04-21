const Sequelize = require('sequelize');
const db = require('../config/db');
const Post = require('./Post');
const Like = require('./Like');
const Comment = require('./Comment');
const Notification = require('./Notification');

const User = db.define('user', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  isSuperAdmin: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAdmin: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(Post);
Post.belongsTo(User);
User.hasMany(Like);
User.hasMany(Comment);
Comment.belongsTo(User);
User.hasMany(Notification);
User.hasMany(Notification, { foreignKey: 'targetUid' });

module.exports = User;
