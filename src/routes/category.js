const express = require('express');
const { auth } = require('../services/auth');

const router = express.Router();
const { getAll } = require('../controllers/category');

router.get('/', async (req, res) => {
  try {
    const categories = await getAll();

    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
