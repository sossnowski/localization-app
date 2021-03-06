const Sequelize = require('sequelize');
const db = require('../config/db');
const Post = require('./Post');

const Localization = db.define('localization', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
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

module.exports = Localization;
