const Category = require('../models/Category');
const Localization = require('../models/Localization');
const Post = require('../models/Post');
const TripCategory = require('../models/TripCategory');
const User = require('../models/User');

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

const addUserToLocalization = async () => {
  const localizations = await Localization.findAll({
    include: [
      {
        model: Post,
        // attributes: ['title'],
        sort: [['createdAt', 'ASC']],
        limit: 1,
      },
    ],
  });
  for (const l of localizations) {
    try {
      l.userUid = l.posts[0].userUid;
      await l.save();
    } catch (e) {
      console.log(l, l.posts);
    }
  }
};

module.exports.seedCategories = async () => {
  const categoriesFromDb = await Category.findAll({});
  const tripCategoriesFromDb = await TripCategory.findAll({});
  if (!categoriesFromDb.length) await Category.bulkCreate(categories);
  if (!tripCategoriesFromDb.length)
    await TripCategory.bulkCreate(tripCategories);
  // addUserToLo  calization();
};
