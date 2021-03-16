const express = require('express');

const router = express.Router();
const { register, login } = require('../controllers/users');

router.post('/register', async (req, res, next) => {
  try {
    await register(req.body);

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await login(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
