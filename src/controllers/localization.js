const Localization = require('../models/Localization');

module.exports.getAll = async () => Localization.findAll({});

module.exports.add = async (data) => Localization.create(data);
