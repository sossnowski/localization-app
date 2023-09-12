const Trip = require('../models/Trip');

module.exports.tripExists = async (uid) => {
  const trip = await Trip.findOne({ where: { uid } });

  return !!trip;
};
