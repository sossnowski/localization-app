const express = require('express');

const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res, next) => {
  try {
    await db.sync({ alter: true });

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
