const Localization = require('../models/Localization');
const Trip = require('../models/Trip');
const sequelize = require('../config/db');
const TripCategory = require('../models/TripCategory');
const Post = require('../models/Post');
const Photo = require('../models/Photo');
const User = require('../models/User');
const db = require('../config/db');
const Like = require('../models/Like');

module.exports.getTripsFromAreaMobile = async (points, categories) => {
  const { minX, maxX, minY, maxY } = points;
  const contains = sequelize.fn(
    'ST_INTERSECTS',
    sequelize.fn(
      'ST_POLYFROMTEXT',
      `POLYGON((${minX} ${maxY},${maxX} ${maxY},${maxX} ${minY},${minX} ${minY},${minX} ${maxY}))`
    ),
    sequelize.col('geometry')
  );
  console.log(categories);

  const allTrips = await Trip.findAll({
    // raw: true,
    attributes: ['uid', 'geometry', 'title', 'duration'],
    where: contains,
    include: [
      {
        model: TripCategory,
        attributes: ['name'],
        where: {
          name: categories,
        },
      },
    ],
    group: ['uid'],
  });
  return allTrips;

  // return filterLocalizationsByCoordinatesMobile(allExtentLocalizations, {
  //   minX,
  //   maxX,
  //   minY,
  //   maxY,
  // });
};

module.exports.getTripByUid = async (uid) =>
  Trip.findOne({
    where: { uid },
    include: [
      {
        model: Localization,
        attributes: ['uid', 'city', 'name'],
        through: {
          attributes: [],
        },
        include: [
          {
            model: Post,
            limit: 1,
            separate: true,
            order: [['likesNumber', 'desc']],
            include: [{ model: Photo, attributes: ['uid', 'filename'] }],
          },
        ],
      },
      {
        model: TripCategory,
        attributes: ['name'],
      },
      { model: User, attributes: ['username'] },
      { model: Like, attributes: ['userUid', 'tripUid', 'isUpVote', 'uid'] },
    ],
  });

module.exports.createTrip = async (trip, userUid) => {
  console.log(trip.tripLocalizations);
  const localizations = await Localization.findAll({
    where: {
      uid: trip.tripLocalizations,
    },
  });
  console.log(localizations, 'ewufuiewrfheriu');
  const lineString = {
    type: 'LineString',
    coordinates: localizations.map((l) => l.geometry?.coordinates),
  };
  const transaction = await db.transaction();
  try {
    const savedTrip = await Trip.create(
      { ...trip, geometry: lineString, userUid },
      { transaction }
    );
    await savedTrip.addLocalizations(localizations, { transaction });
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};
