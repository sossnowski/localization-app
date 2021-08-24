const express = require('express');

const router = express.Router();
const { register, login, update, confirm } = require('../controllers/users');
const { auth } = require('../services/auth');
const validation = require('../validation/user');
const validate = require('../validation/main');

router.post(
  '/register',
  validate(validation.register),
  async (req, res, next) => {
    try {
      await register(req.body);

      res.status(201).json({ message: 'User created' });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/login', validate(validation.login), async (req, res, next) => {
  try {
    const result = await login(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/', auth, validate(validation.update), async (req, res, next) => {
  try {
    const post = await update(req.body, req.data.uid);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.get('/confirm/:token', async (req, res, next) => {
  try {
    await confirm(req.params.token);

    res.status(200).json({ message: 'Account confirmed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
