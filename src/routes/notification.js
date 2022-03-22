const express = require('express');

const router = express.Router();
const {
  getAll,
  setNotificationAsSeen,
  setAllCommentNotificationsAsSeen,
  setAllPostNotificationsAsSeen,
} = require('../controllers/notification');
const { auth } = require('../services/auth');

router.get('/:offset', auth, async (req, res, next) => {
  try {
    const notifications = await getAll(req.params.offset, req.data.uid);

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
});

router.patch('/seen/:uid', auth, async (req, res, next) => {
  try {
    await setNotificationAsSeen(req.params.uid, req.data.uid);

    res.status(200).json({ message: 'saved' });
  } catch (error) {
    next(error);
  }
});

router.patch('/seen/comment/:uid', auth, async (req, res, next) => {
  try {
    await setAllCommentNotificationsAsSeen(req.params.uid, req.data.uid);

    res.status(200).json({ message: 'saved' });
  } catch (error) {
    next(error);
  }
});

router.patch('/seen/post/:uid', auth, async (req, res, next) => {
  try {
    await setAllPostNotificationsAsSeen(req.params.uid, req.data.uid);

    res.status(200).json({ message: 'saved' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
