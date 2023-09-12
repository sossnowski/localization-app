const TripCategory = require('../models/TripCategory');

module.exports.getAllTripCategories = () => TripCategory.findAll({});
