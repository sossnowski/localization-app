const express = require('express');

const router = express.Router();
const { getAll, add } = require('../controllers/localization');

router.get('/', async (req, res, next) => {
  try {
    const localizations = await getAll();

    res.status(200).json(localizations);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const localization = await add(req.body);

    res.status(200).json(localization);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
