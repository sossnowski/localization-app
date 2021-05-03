const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.auth = (req, res, next) => {
  try {
    console.log(req.body, req.post);
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.data = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'auth failed',
    });
  }
};

module.exports.generateToken = (data) =>
  jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED,
  });
