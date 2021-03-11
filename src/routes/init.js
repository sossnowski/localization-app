const express = require('express');
const { forceInit } = require('../controllers/init');

const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    await db.sync({ alter: true });

    res.status(200).json({
      success: true,
      message: 'synchronised',
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/force', async (req, res) => {
  try {
    await forceInit();

    res.status(200).json({
      success: true,
      message: 'synchronised',
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
