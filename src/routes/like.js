const express = require('express');

const router = express.Router();
const {
  setLike,
  addLike,
  setCommentLike,
  addCommentLike,
} = require('../controllers/like');
const { auth } = require('../services/auth');

router.patch('/post', auth, async (req, res, next) => {
  try {
    await setLike(req.body.postUid, req.body.isUpVote, req.data.uid);
    res.status(200).json({
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/post', auth, async (req, res, next) => {
  try {
    const like = await addLike(
      req.body.postUid,
      req.body.isUpVote,
      req.data.uid
    );
    res.status(201).json(like);
  } catch (error) {
    next(error);
  }
});

router.patch('/comment', auth, async (req, res, next) => {
  try {
    await setCommentLike(req.body.commentUid, req.body.isUpVote, req.data.uid);
    res.status(200).json({
      message: 'success',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/comment', auth, async (req, res, next) => {
  try {
    const like = await addCommentLike(
      req.body.commentUid,
      req.body.isUpVote,
      req.data.uid
    );
    res.status(201).json(like);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
