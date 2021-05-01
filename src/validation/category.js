const { check } = require('express-validator');

module.exports = [check('text').isString().notEmpty().exists()];
