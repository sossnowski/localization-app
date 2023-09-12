const Sequelize = require('sequelize');
const db = require('../config/db');
const Trip = require('./Trip');

const TripCategory = db.define('tripCategory', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});
TripCategory.hasMany(Trip);
Trip.belongsTo(TripCategory);

module.exports = TripCategory;
