const express = require('express');
const { auth } = require('../services/auth');

const router = express.Router();
const {
  getPostComments,
  add,
  update,
  deleteByUid,
  getLikes,
  getPostByComment,
} = require('../controllers/comment');
const { emitCommentEvent } = require('../services/socket/comment');
const validationRules = require('../validation/comment');
const validate = require('../validation/main');

router.get('/:postUid', auth, async (req, res, next) => {
  try {
    const comments = await getPostComments(req.params.postUid);

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

router.get('/withPostData/:commentUid', auth, async (req, res, next) => {
  try {
    const comments = await getPostByComment(req.params.commentUid);

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, validate(validationRules), async (req, res, next) => {
  try {
    const comment = await add(req.body, req.data.uid);
    emitCommentEvent(req.app.get('io'), {
      comment,
      actionUser: req.data,
      localizationUid: req.body.localizationUid,
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

router.patch('/', auth, validate(validationRules), async (req, res, next) => {
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

router.get('/likes/:uid', auth, async (req, res, next) => {
  try {
    const likes = await getLikes(req.params.uid);

    res.status(200).json(likes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
