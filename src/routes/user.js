const express = require('express');

const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({});

    console.log(users);
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/signup', async (req, res, next) => {
  try {
    const user = await User.create({
      username: 'test',
      email: 'test@tes.pl',
      password: 'test',
    });

    console.log(user);
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
