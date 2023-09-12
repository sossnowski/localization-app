const Sequelize = require('sequelize');
const db = require('../config/db');
const Like = require('./Like');
const Comment = require('./Comment');
const Localization = require('./Localization');

const Trip = db.define('trip', {
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
  duration: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  distance: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  keywords: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  geometry: {
    type: Sequelize.DataTypes.GEOMETRY('LINESTRING'),
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
});

Trip.hasMany(Like, {
  onDelete: 'cascade',
});
Like.belongsTo(Trip);
Trip.hasMany(Comment, {
  onDelete: 'cascade',
});
Comment.belongsTo(Trip);
Trip.belongsToMany(Localization, { through: 'tripLocalizations' });
Localization.belongsToMany(Trip, { through: 'tripLocalizations' });

module.exports = Trip;
