const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const CustomError = require('../helpers/error');
const { generateToken, confirmationAuth } = require('../services/auth');

const saltRounds = 12;

module.exports.register = async (user) => {
  const registeredUser = await User.findOne({
    where: {
      [Op.or]: [{ username: user.username }, { email: user.email }],
    },
  });

  if (registeredUser) throw new CustomError(400, 'User exist');

  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  if (hashedPassword) {
    const newUser = { ...user, password: hashedPassword };
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
    },
  };
};

module.exports.update = async (userData, uid) => {
  if (userData.password && userData.password !== '') {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
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
  }
  throw new CustomError(400, 'Bad Request');
};
