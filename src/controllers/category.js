const Category = require('../models/Category');

module.exports.getAll = () => Category.findAll({});
