const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const CustomError = require('../helpers/error');

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

  if (!authorized) throw new CustomError(401, 'Invalid credentials');

  return {
    token: 'jdbvjfvbjvfbfjbvf',
    user: {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
    },
  };
};
