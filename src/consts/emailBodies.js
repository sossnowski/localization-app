const { generateConfirmationToken } = require('../services/auth');

require('dotenv').config();

module.exports.welcomeMail = (userData) => {
  const html = `<div style="text-center"><p>Dziękujemy za rejestrację! Potwierdź konto klikając w link! <a href="${
    process.env.CONFIRMATION_URL
  }/${generateConfirmationToken(userData)}">Klik</a></p></div>`;

  return html;
};
