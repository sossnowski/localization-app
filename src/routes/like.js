const express = require('express');

const router = express.Router();
const { setLike, addLike } = require('../controllers/like');
const { auth } = require('../services/auth');

router.patch('/set/post', auth, async (req, res, next) => {
  try {
    await setLike(req.body.postUid, req.body.isUpVote, req.data.uid);
    res.status(200).json({
      message: 'success',
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/add/post', auth, async (req, res, next) => {
  try {
    const like = await addLike(
      req.body.postUid,
      req.body.isUpVote,
      req.data.uid
    );
    res.status(201).json(like);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
