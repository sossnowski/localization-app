const { Op } = require('sequelize');
const Localization = require('../models/Localization');
const sequelize = require('../config/db');
const Category = require('../models/Category');
const {
  filterLocalizationsByCoordinates,
  filterLocalizationsByCoordinatesMobile,
} = require('../services/localization');

module.exports.getAll = async () => Localization.findAll({});

module.exports.get = async (uid) => Localization.findOne({ where: { uid } });

module.exports.add = async (data) => {
  data.city = data.city.toLowerCase();
  Localization.create(data);
};

module.exports.getFromArea = async (points, categories) => {
  const { minX, maxX, minY, maxY } = points;
  const contains = sequelize.fn(
    'ST_CONTAINS',
    sequelize.fn(
      'ST_POLYFROMTEXT',
      `POLYGON((${minX} ${maxY},${maxX} ${maxY},${maxX} ${minY},${minX} ${minY},${minX} ${maxY}))`
    ),
    sequelize.col('geometry')
  );

  const allExtentLocalizations = await Localization.findAll({
    raw: true,
    attributes: ['uid', 'geometry', 'city'],
    where: contains,
    include: [
      {
        model: Category,
        attributes: ['name'],
        where: {
          name: categories,
        },
      },
    ],
    group: ['uid'],
  });

  return filterLocalizationsByCoordinates(allExtentLocalizations, {
    minX,
    maxX,
    minY,
    maxY,
  });
};

module.exports.getFromAreaMobile = async (points, categories) => {
  const { minX, maxX, minY, maxY } = points;
  const contains = sequelize.fn(
    'ST_CONTAINS',
    sequelize.fn(
      'ST_POLYFROMTEXT',
      `POLYGON((${minX} ${maxY},${maxX} ${maxY},${maxX} ${minY},${minX} ${minY},${minX} ${maxY}))`
    ),
    sequelize.col('geometry')
  );

  const allExtentLocalizations = await Localization.findAll({
    raw: true,
    attributes: ['uid', 'geometry', 'city'],
    where: contains,
    include: [
      {
        model: Category,
        attributes: ['name'],
        where: {
          name: categories,
        },
      },
    ],
    group: ['uid'],
  });

  return filterLocalizationsByCoordinatesMobile(allExtentLocalizations, {
    minX,
    maxX,
    minY,
    maxY,
  });
};

module.exports.getOwnFromAreaMobile = async (points, categories, userUid) => {
  const { minX, maxX, minY, maxY } = points;
  const contains = sequelize.fn(
    'ST_CONTAINS',
    sequelize.fn(
      'ST_POLYFROMTEXT',
      `POLYGON((${minX} ${maxY},${maxX} ${maxY},${maxX} ${minY},${minX} ${minY},${minX} ${maxY}))`
    ),
    sequelize.col('geometry')
  );

  const allExtentLocalizations = await Localization.findAll({
    raw: true,
    attributes: ['uid', 'geometry', 'city'],
    where: { [Op.and]: [contains, { userUid }] },
    group: ['uid'],
  });

  return filterLocalizationsByCoordinatesMobile(allExtentLocalizations, {
    minX,
    maxX,
    minY,
    maxY,
  });
};

module.exports.getAllGroupedByPlace = (categories) => {
  if (!categories || !categories.length)
    return Localization.findAll({ group: 'city' });
  return Localization.findAll({
    include: { model: Category, where: { name: categories } },
    group: 'city',
  });
};
