const Category = require('../models/Category');

const categories = [
  {
    name: 'impreza',
  },
  {
    name: 'rekreacja',
  },
  {
    name: 'sport',
  },
  {
    name: 'hobby',
  },
  {
    name: 'odpoczynek',
  },
  {
    name: 'zwiedzanie',
  },
  {
    name: 'kultura',
  },
  {
    name: 'inne',
  },
];

module.exports.seedCategories = async () => {
  const categoriesFromDb = await Category.findAll({});
  if (categoriesFromDb.length) return;

  await Category.bulkCreate(categories);
};
