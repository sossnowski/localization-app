const Localization = require('../models/Localization');

module.exports.getAll = async () => Localization.findAll({});
