const { check } = require('express-validator');

module.exports.register = [
  check('email').normalizeEmail().isEmail().exists(),
  check('password').isString().notEmpty().exists(),
  check('username').isString().notEmpty().exists(),
];

module.exports.login = [
  check('username').isString().notEmpty().exists(),
  check('password').isString().notEmpty().exists(),
];

module.exports.update = [
  check('email').normalizeEmail().isEmail(),
  check('password').isString().notEmpty().optional(),
  check('username').isString().notEmpty(),
];
