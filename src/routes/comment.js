const express = require('express');

const router = express.Router();
const Comment = require('../models/Post');
const Like = require('../models/Like');

router.get('/:postUid', async (req, res, next) => {
  const { postUid } = req.params;
  try {
    const comments = await Comment.findAll({ include: 'like', where: postUid });

    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
