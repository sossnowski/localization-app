const express = require('express');
const { forceInit } = require('../controllers/init');

const router = express.Router();
const db = require('../config/db');
const { seedCategories } = require('../config/categorySeed');
const { migrateData, assignLikes } = require('../../script');
// const Notification = require('../models/Notification');

router.get('/', async (req, res, next) => {
  try {
    // await db.sync({ alter: true });
    // await seedCategories();
    // await Notification.sync();
    // await migrateData();
    await assignLikes();

    res.status(200).json({
      success: true,
      message: 'synchronised',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// router.get('/force', async (req, res) => {
//   try {
//     await db.sync({ force: true });
//     await seedCategories();

//     res.status(200).json({
//       success: true,
//       message: 'synchronised',
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
