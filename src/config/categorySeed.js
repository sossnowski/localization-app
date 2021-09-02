const Category = require('../models/Category');

const categories = [
  {
    name: 'melanż',
  },
  {
    name: 'deska',
  },
  {
    name: 'szamka',
  },
  {
    name: 'chillout',
  },
  {
    name: 'sport',
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
