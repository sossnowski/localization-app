const express = require('express');

const router = express.Router();
const Post = require('../models/Post');
const Like = require('../models/Like');

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({ include: ['user', Like] });

    console.log(posts);
    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/withOwner', async (req, res, next) => {
  try {
    const posts = await Post.findAll({ include: 'user' });

    console.log(posts);
    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/add', async (req, res, next) => {
  try {
    const post = await Post.create({
      title: 'test12',
      description: 'jakis opis123',
      userUid: 'c2f49432-41af-43f8-9d8c-235a68b9b5b5',
      localization: { type: 'Point', coordinates: [1, 0] },
    });

    console.log(post);
    res.status(200).json({
      post,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
