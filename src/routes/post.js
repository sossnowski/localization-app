const express = require('express');

const router = express.Router();
const Post = require('../models/Post');
const { getByCategory, getAll } = require('../controllers/post');

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

router.get('/:category', async (req, res, next) => {
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

router.get('/add', async (req, res, next) => {});

module.exports = router;
