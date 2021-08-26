const { generateConfirmationToken } = require('../../services/auth');

module.exports = (email) =>
  `<div style="text-center"><p>Otrzymaliśmy prośbę o zmianę hasła do konta w SpotFinder. W celu wygenerowania nowego kliknij w link <a href="${
    process.env.RESET_PASSWORD_URL
  }/${generateConfirmationToken(
    email
  )}">Klik</a>. Jeżeli to nie twoja prośba, po prostu zignoruj wiadomość. POZDRO!</p></div>`;
