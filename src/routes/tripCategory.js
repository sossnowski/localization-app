const express = require('express');

const router = express.Router();
const { getAllTripCategories } = require('../controllers/tripCategory');

router.get('/', async (req, res) => {
  try {
    const categories = await getAllTripCategories();

    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
