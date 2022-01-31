const { check } = require('express-validator');

module.exports = [
  check('name').isString(),
  check('city').isString().optional({ nullable: true }),
  check('geometry.coordinates').isArray().notEmpty().exists(),
  check('geometry.type').isString().notEmpty().exists(),
];
