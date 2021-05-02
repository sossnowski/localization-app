const { check } = require('express-validator');

module.exports.create = [
  check('localizationUid').isUUID().notEmpty().exists(),
  check('title').isString().notEmpty().exists(),
  check('description').isString().notEmpty().exists(),
];

module.exports.update = [
  check('localizationUid').isUUID().notEmpty().exists(),
  check('title').isString().notEmpty(),
  check('description').isString().notEmpty(),
];
