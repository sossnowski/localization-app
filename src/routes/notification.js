const express = require('express');

const router = express.Router();
const {
  getAll,
  setNotificationAsSeen,
} = require('../controllers/notification');
const { auth } = require('../services/auth');
const validationRules = require('../validation/notification');
const validate = require('../validation/main');

router.get('/:offset', auth, async (req, res, next) => {
  try {
    const notifications = await getAll(req.params.offset, req.data.uid);

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/seen/:uid',
  auth,
  validate(validationRules),
  async (req, res, next) => {
    try {
      await setNotificationAsSeen(req.params.uid, req.data.uid);

      res.status(200).json({ message: 'saved' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
