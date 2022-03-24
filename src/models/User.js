const Sequelize = require('sequelize');
const db = require('../config/db');
const Post = require('./Post');
const Like = require('./Like');
const Comment = require('./Comment');
const Notification = require('./Notification');
const Notification2 = require('./Notification2');

const User = db.define('user', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: 'username',
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: 'email',
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
  isConfirmed: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mobileToken: {
    type: Sequelize.DataTypes.STRING,
    defaultValue: null,
  },
  mobileOS: {
    type: Sequelize.DataTypes.STRING,
    defaultValue: null,
  },
  configuration: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(Post);
Post.belongsTo(User);
User.hasMany(Like);
User.hasMany(Comment);
Comment.belongsTo(User);
User.hasMany(Notification, { foreignKey: 'targetUid' });
User.hasMany(Notification2, {
  onDelete: 'cascade',
});

module.exports = User;
