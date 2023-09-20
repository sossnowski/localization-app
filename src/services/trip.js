const Trip = require('../models/Trip');

module.exports.tripExists = async (uid) => {
  const trip = await Trip.findOne({ where: { uid } });

  return !!trip;
};

module.exports.isUserTripOwner = async (tripUid, userUid) => {
  const trip = await Trip.findOne({
    where: {
      uid: tripUid,
    },
  });

  return trip?.userUid === userUid;
};
