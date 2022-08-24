const Category = require('../models/Category');

const categories = [
  {
    name: 'party',
  },
  {
    name: 'skateboard',
  },
  {
    name: 'food',
  },
  {
    name: 'chillout',
  },
  {
    name: 'sport',
  },
  {
    name: 'camping',
  },
  {
    name: 'tips',
  },
  {
    name: 'accommodation',
  },
  {
    name: 'other',
  },
];

module.exports.seedCategories = async () => {
  const categoriesFromDb = await Category.findAll({});
  if (categoriesFromDb.length) return;

  await Category.bulkCreate(categories);
};
