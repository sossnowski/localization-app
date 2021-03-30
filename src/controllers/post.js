const { Op } = require('sequelize');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Localization = require('../models/Localization');
const CustomError = require('../helpers/error');
const { isUserPostOwner } = require('../services/post');
const db = require('../config/db');

module.exports.getAll = async () => {
  const posts = await Post.findAll({
    include: [Category, User, Comment, Like],
  });

  return posts;
};

module.exports.getByUid = async (uid) => {
  const post = await Post.findOne({ where: { uid } });

  return post;
};

module.exports.getByLocalization = async (uid) => {
  const posts = Localization.findOne({
    where: { uid },
    include: {
      model: Post,
      include: [User, Comment, Like],
    },
  });

  return posts;
};

module.exports.getByCategory = async (category) => {
  const posts = await Post.findAll({
    include: [
      { model: Category, where: { name: category } },
      User,
      Comment,
      Like,
    ],
  });

  return posts;
};

module.exports.getFromLocalizations = async (localizations) => {
  const posts = await Post.findAll({
    include: [
      {
        model: Localization,
        where: {
          uid: {
            [Op.or]: localizations,
          },
        },
      },
      Category,
      User,
      Comment,
      Like,
    ],
  });

  return posts;
};

module.exports.add = async (postData, userUid) => {
  const localizationToAdd = {
    geometry: postData.geometry,
    city: postData.city,
  };

  const result = await db.transaction(async (t) => {
    const localization = await Localization.create(localizationToAdd, {
      transaction: t,
    });
    const postToAdd = {
      ...postData,
      userUid,
      localizationUid: localization.uid,
    };
    delete postToAdd.city;
    delete postToAdd.geometry;
    const post = await Post.create(postToAdd, { transaction: t });

    return { ...post.dataValues, localization: localization.dataValues };
  });

  return result;
};

module.exports.addToLocalization = async (postData, userUid) =>
  Post.create({ ...postData, userUid });
