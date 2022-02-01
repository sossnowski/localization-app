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
  check('email').normalizeEmail().isEmail().optional({ nullable: true }),
  check('password').isString().optional({ nullable: true }),
  check('username').isString().optional({ nullable: true }),
  check('mobileToken').isString().optional({ nullable: true }),
  check('mobileOs').isString().optional({ nullable: true }),
];

module.exports.setNewPassword = [
  check('token').isString().notEmpty().exists(),
  check('password').isString().notEmpty().exists(),
];

module.exports.setConfiguration = [
  check('configuration').isString().notEmpty().exists(),
];

module.exports.email = [check('email').normalizeEmail().isEmail().exists()];
