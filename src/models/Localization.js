const Sequelize = require('sequelize');
const db = require('../config/db');
const Post = require('./Post');
const Category = require('./Category');

const Localization = db.define('localization', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  geometry: {
    type: Sequelize.DataTypes.GEOMETRY('POINT'),
    allowNull: false,
  },
  city: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

Localization.hasMany(Post);
Post.belongsTo(Localization);
Localization.belongsTo(Category);
Category.hasMany(Localization);

module.exports = Localization;
