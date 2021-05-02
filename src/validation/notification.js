const { check } = require('express-validator');

module.exports = [check('isUpVote').isBoolean().notEmpty().exists()];
