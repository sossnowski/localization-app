const express = require('express');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();

app.use(compression());

const userRoutes = require('./src/routes/user');
const postRoutes = require('./src/routes/post');
const likeRoutes = require('./src/routes/like');
const initRoutes = require('./src/routes/init');
const commentRoutes = require('./src/routes/comment');
const localizationRoutes = require('./src/routes/localization');
const categoryRoutes = require('./src/routes/category');
const notificationRoutes = require('./src/routes/notification');
const { seedCategories } = require('./src/config/categorySeed');

const limiter = rateLimit({
  windowMs: 1 * 1000, // ms
  max: 20, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.urlencoded());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});
seedCategories();
app.use('/mapStyles', express.static('mapStyles/mapStyle.json'));
app.use(
  '/font/tmp/:type/:range/font.pbf',
  express.static('mapStyles/font.pbf')
);
app.use('/pictures', express.static('pictures'));
// app.use('/init', initRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/like', likeRoutes);
app.use('/comment', commentRoutes);
app.use('/localization', localizationRoutes);
app.use('/category', categoryRoutes);
app.use('/notification', notificationRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
