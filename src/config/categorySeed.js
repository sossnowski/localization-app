const Category = require('../models/Category');
const TripCategory = require('../models/TripCategory');

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

const tripCategories = [
  {
    name: 'walk',
  },
  {
    name: 'bike',
  },
  {
    name: 'car',
  },
];

module.exports.seedCategories = async () => {
  const categoriesFromDb = await Category.findAll({});
  const tripCategoriesFromDb = await TripCategory.findAll({});
  if (!categoriesFromDb.length) await Category.bulkCreate(categories);
  if (!tripCategoriesFromDb.length)
    await TripCategory.bulkCreate(tripCategories);
};
