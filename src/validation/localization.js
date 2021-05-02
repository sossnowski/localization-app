const { check } = require('express-validator');

module.exports = [
  check('name').isString().notEmpty().exists(),
  check('city').isString().notEmpty().exists(),
  check('geometry.coordinates').isArray().notEmpty().exists(),
  check('geometry.type').isString().notEmpty().exists(),
];
