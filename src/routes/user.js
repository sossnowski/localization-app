const express = require('express');

const router = express.Router();
const {
  register,
  login,
  update,
  confirm,
  resetPassword,
  setNewPassword,
  setConfiguration,
} = require('../controllers/users');
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

router.get(
  '/resetPassword/:email',
  validate(validation.email),
  async (req, res, next) => {
    try {
      await resetPassword(req.params.email);

      res.status(200).json({ message: 'Email sended' });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/setNewPassword',
  validate(validation.setNewPassword),
  async (req, res, next) => {
    try {
      await setNewPassword(req.body);

      res.status(200).json({ message: 'Password changed' });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/setUserConfiguration/',
  validate(validation.setConfiguration),
  auth,
  async (req, res, next) => {
    try {
      await setConfiguration(req.body.configuration, req.data.uid);

      res.status(200).json({ message: 'Configuration saved' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
