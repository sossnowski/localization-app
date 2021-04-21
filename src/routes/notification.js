const express = require('express');

const router = express.Router();
const { getAll } = require('../controllers/notification');
const { auth } = require('../services/auth');

router.get('/:offset', auth, async (req, res, next) => {
  try {
    const notifications = await getAll(req.params.offset, req.data.uid);

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
