const welcomeHtml = require('./emailHtmls/welcome');
const resetPasswordHtml = require('./emailHtmls/resetPassword');

require('dotenv').config();

module.exports = {
  welcomeMailBody: (userData) => welcomeHtml(userData),
  resetPasswordMailBody: (email) => resetPasswordHtml(email),
};
