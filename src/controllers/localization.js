const Localization = require('../models/Localization');
const sequelize = require('../config/db');
const Category = require('../models/Category');

module.exports.getAll = async () => Localization.findAll({});

module.exports.get = async (uid) => Localization.findOne({ where: { uid } });

module.exports.add = async (data) => {
  data.city = data.city.toLowerCase();
  Localization.create(data);
};

module.exports.getFromArea = async (points, categories) => {
  const { a, b, c, d, e } = points;
  const contains = sequelize.fn(
    'ST_CONTAINS',
    sequelize.fn(
      'ST_POLYFROMTEXT',
      `POLYGON((${a.split(',')[0]} ${a.split(',')[1]},${b.split(',')[0]} ${
        b.split(',')[1]
      },${c.split(',')[0]} ${c.split(',')[1]},${d.split(',')[0]} ${
        d.split(',')[1]
      },${e.split(',')[0]} ${e.split(',')[1]}))`
    ),
    sequelize.col('geometry')
  );

  return Localization.findAll({
    where: contains,
    include: {
      model: Category,
      where: {
        name: categories,
      },
    },
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
