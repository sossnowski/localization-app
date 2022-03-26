const express = require('express');

const router = express.Router();
const {
  getByCategory,
  getAll,
  getFromLocalization,
  add,
  update,
  getByUid,
  deleteByUid,
  addToLocalization,
} = require('../controllers/post');
const { fileUploader } = require('../services/post');
const { auth } = require('../services/auth');
const { emitPostEvent } = require('../services/socket/post');
const validationRules = require('../validation/post');
const validate = require('../validation/main');

router.get('/', async (req, res, next) => {
  try {
    const posts = await getAll();

    res.status(200).json({
      posts,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:uid', async (req, res, next) => {
  try {
    const post = await getByUid(req.params.uid);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.get('/localizations/:uid', async (req, res, next) => {
  try {
    const posts = await getFromLocalization(req.params.uid);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get('/category/:category', async (req, res, next) => {
  const { category } = req.params;
  try {
    const posts = await getByCategory(category);

    res.status(200).json({
      posts,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  auth,
  fileUploader,
  validate(validationRules.createByLocalization),
  async (req, res, next) => {
    try {
      const post = await add(req.body, req.files, req.data.uid);

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/localization',
  auth,
  fileUploader,
  validate(validationRules.create),
  async (req, res, next) => {
    try {
      const post = await addToLocalization(req.body, req.files, req.data.uid);
      emitPostEvent(req.app.get('io'), post);

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/',
  auth,
  validate(validationRules.update),
  async (req, res, next) => {
    try {
      const post = await update(req.body, req.data.uid);

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:uid', auth, async (req, res, next) => {
  try {
    await deleteByUid(req.params.uid, req.data.uid);

    res.status(200).json({ message: 'Successfuly removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
