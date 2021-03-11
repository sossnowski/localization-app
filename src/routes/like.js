const express = require('express');

const router = express.Router();
const Like = require('../models/Like');

router.get('/', async (req, res, next) => {
  try {
    const likes = await Like.findAll({});

    console.log(likes);
    res.status(200).json({
      likes,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/withOwner', async (req, res, next) => {
  try {
    const posts = await Like.findAll({ include: 'user' });

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
    const like = await Like.create({
      isUpVote: true,
      userUid: 'c2f49432-41af-43f8-9d8c-235a68b9b5b5',
      postUid: '52634bab-1e8d-42e3-b2fa-00e70e557e70',
    });

    res.status(200).json({
      like,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
