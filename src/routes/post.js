const express = require('express');

const router = express.Router();
const {
  getByCategory,
  getAll,
  getByLocalization,
  getFromLocalizations,
  add,
  update,
  getByUid,
  deleteByUid,
  addToLocalization,
} = require('../controllers/post');
const { fileUploader } = require('../services/post');
const { auth } = require('../services/auth');

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

router.get('/localization/:uid', async (req, res, next) => {
  try {
    const posts = await getByLocalization(req.params.uid);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

router.get('/localizations/uids', async (req, res, next) => {
  try {
    const posts = await getFromLocalizations(req.query.uids);

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

router.post('/', auth, fileUploader, async (req, res, next) => {
  try {
    const post = await add(req.body, req.data.uid);

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.post('/localization', auth, fileUploader, async (req, res, next) => {
  try {
    const post = await addToLocalization(req.body, req.files, req.data.uid);

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.patch('/', auth, async (req, res, next) => {
  try {
    const post = await update(req.body, req.data.uid);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

router.delete('/:uid', auth, async (req, res, next) => {
  try {
    await deleteByUid(req.params.uid, req.data.uid);

    res.status(200).json({ message: 'Successfuly removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
