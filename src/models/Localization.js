const Sequelize = require('sequelize');
const db = require('../config/db');
const Post = require('./Post');
const Category = require('./Category');
const Trip = require('./Trip');

const Localization = db.define(
  'localization',
  {
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
      allowNull: true,
    },
  },
  {
    indexes: [{ fields: ['geometry'] }],
  }
);

Localization.hasMany(Post, {
  onDelete: 'cascade',
});
Post.belongsTo(Localization, {
  onDelete: 'cascade',
});
Localization.belongsTo(Category);
Category.hasMany(Localization);

module.exports = Localization;
