const express = require('express');

const { auth } = require('../services/auth');
const validate = require('../validation/main');
const validationRules = require('../validation/trip');
const {
  createTrip,
  getTripsFromAreaMobile,
  getTripByUid,
  deleteTripByUid,
} = require('../controllers/trip');

const router = express.Router();

router.get('/mobile/extent/:minX/:maxX/:minY/:maxY', async (req, res, next) => {
  try {
    const localization = await getTripsFromAreaMobile(
      req.params,
      req.query.categories
    );

    res.status(200).json(localization);
  } catch (error) {
    next(error);
  }
});

router.get('/:uid', auth, async (req, res, next) => {
  try {
    console.log(req.data.uid);
    const localization = await getTripByUid(req.params.uid);

    res.status(200).json(localization);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  auth,
  validate(validationRules.create),
  async (req, res, next) => {
    try {
      const trip = await createTrip(req.body, req.data.uid);

      res.status(201).json(trip);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:uid', auth, async (req, res, next) => {
  try {
    await deleteTripByUid(req.params.uid, req.data.uid);

    res.status(200).json({ message: 'Successfuly removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
