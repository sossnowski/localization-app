const express = require('express');

const router = express.Router();
const {
  setLike,
  addLike,
  setCommentLike,
  addCommentLike,
} = require('../controllers/like');
const { auth } = require('../services/auth');
const {
  emitPostLikeEvent,
  emitPostLikeUpdateEvent,
} = require('../services/socket/like');

router.patch('/post', auth, async (req, res, next) => {
  try {
    await setLike(req.body.postUid, req.body.isUpVote, req.data.uid);
    emitPostLikeUpdateEvent(req.app.get('io'), {
      ...req.body,
      actionUser: req.data,
    });
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
    emitPostLikeEvent(req.app.get('io'), {
      like,
      actionUser: req.data,
    });
    res.status(201).json(like);
  } catch (error) {
    next(error);
  }
});

router.patch('/comment', auth, async (req, res, next) => {
  try {
    await setCommentLike(req.body.commentUid, req.body.isUpVote, req.data.uid);
    console.log(req.app.get('io'));
    req.app
      .get('io')
      .to('f9bfb860-fba8-4b07-86e7-d838f7fb2942')
      .emit('test', 'jest dana');
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
