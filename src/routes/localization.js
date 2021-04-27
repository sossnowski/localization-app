const express = require('express');

const router = express.Router();
const {
  getAll,
  add,
  get,
  getFromArea,
} = require('../controllers/localization');
const { auth } = require('../services/auth');

router.get('/', auth, async (req, res, next) => {
  try {
    const localizations = await getAll();

    res.status(200).json(localizations);
  } catch (error) {
    next(error);
  }
});

router.get('/:uid', auth, async (req, res, next) => {
  try {
    const localization = await get(req.params.uid);

    res.status(200).json(localization);
  } catch (error) {
    next(error);
  }
});

router.get('/:a/:b/:c/:d/:e', auth, async (req, res, next) => {
  try {
    const localization = await getFromArea(req.params);

    res.status(200).json(localization);
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const localization = await add(req.body);

    res.status(200).json(localization);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
