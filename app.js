const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config();
// const db = require('./src/config/db');
const userRoutes = require('./src/routes/user');
const postRoutes = require('./src/routes/post');
const likeRoutes = require('./src/routes/like');
const initRoutes = require('./src/routes/init');
const commentRoutes = require('./src/routes/comment');
const localizationRoutes = require('./src/routes/localization');

// db.authenticate()
//   .then(console.log('connected'))
//   .catch((error) => throw error);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH');
    return res.status(200).json({});
  }
  next();
});

app.use('/init', initRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/like', likeRoutes);
app.use('/comment', commentRoutes);
app.use('/localization', localizationRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
