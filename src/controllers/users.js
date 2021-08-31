const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const CustomError = require('../helpers/error');
const { generateToken, confirmationAuth } = require('../services/auth');
const { sendEmail } = require('../services/email');
const { welcomeMail, resetPasswordMail } = require('../consts/emailSubjects');
const {
  welcomeMailBody,
  resetPasswordMailBody,
} = require('../consts/emailBodies');
const { generatePassword } = require('../services/user');

module.exports.register = async (user) => {
  const registeredUser = await User.findOne({
    where: {
      [Op.or]: [{ username: user.username }, { email: user.email }],
    },
  });

  if (registeredUser) throw new CustomError(400, 'User exist');

  const hashedPassword = await generatePassword(user.password);

  if (hashedPassword) {
    const newUser = { ...user, password: hashedPassword };
    await sendEmail(
      newUser.email,
      welcomeMail,
      welcomeMailBody({ email: newUser.email })
    );
    await User.create(newUser);
  }
};

module.exports.login = async (userLoginData) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: userLoginData.username },
        { email: userLoginData.username },
      ],
    },
  });
  if (!user) throw new CustomError(401, 'Invalid credentials');
  const authorized = await bcrypt.compare(
    userLoginData.password,
    user.password
  );

  if (!authorized || user.isConfirmed === false)
    throw new CustomError(401, 'Invalid credentials');

  return {
    token: generateToken({ username: user.username, uid: user.uid }),
    user: {
      uid: user.uid,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      configuration: user.configuration,
    },
  };
};

module.exports.update = async (userData, uid) => {
  if (userData.password && userData.password !== '') {
    const hashedPassword = await generatePassword(userData.password);
    userData.password = hashedPassword;
  } else delete userData.password;
  await User.update(userData, { where: { uid } });

  return userData;
};

module.exports.confirm = async (confirmationToken) => {
  const decodedData = confirmationAuth(confirmationToken);
  if (decodedData) {
    await User.update(
      { isConfirmed: true },
      { where: { email: decodedData.email } }
    );
  } else throw new CustomError(400, 'Bad Request');
};

module.exports.resetPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new CustomError(400, 'Bad Request');
  await sendEmail(email, resetPasswordMail, resetPasswordMailBody({ email }));
};

module.exports.setNewPassword = async ({ token, password }) => {
  const { email } = confirmationAuth(token);
  const hashedPassword = await generatePassword(password);
  if (email)
    await User.update({ password: hashedPassword }, { where: { email } });
  else throw new CustomError(400, 'Bad Request');
};

module.exports.setConfiguration = async (configuration, uid) =>
  User.update({ configuration }, { where: { uid } });
