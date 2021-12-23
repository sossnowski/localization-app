const bcrypt = require('bcrypt');

const saltRounds = 12;

module.exports.generatePassword = async (plainPassword) =>
  bcrypt.hash(plainPassword, saltRounds);
