const { generateConfirmationToken } = require('../../services/auth');

module.exports = (userData) => {
  const token = generateConfirmationToken(userData);
  return `<div style="text-center"><p>Dziękujemy za rejestrację! Potwierdź konto klikając w link! <a href="${process.env.CONFIRMATION_URL}/${token}">Klik</a> Link: ${process.env.CONFIRMATION_URL}/${token}</p></div>`;
};
