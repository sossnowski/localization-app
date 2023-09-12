const { check } = require('express-validator');

module.exports.create = [
  check('tripCategoryUid').isUUID().notEmpty().exists(),
  check('tripLocalizations').isArray().exists(),
  check('title').isString().notEmpty().exists(),
  check('description').isString().notEmpty().exists(),
  check('keywords').isString().exists(),
  check('duration').isString().exists(),
];
