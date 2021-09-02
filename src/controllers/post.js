const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Localization = require('../models/Localization');
const CustomError = require('../helpers/error');
const { isUserPostOwner } = require('../services/post');
const db = require('../config/db');
const Photo = require('../models/Photo');

module.exports.getAll = async () => {
  const posts = await Post.findAll({
    include: [Category, User, Comment, Like],
  });

  return posts;
};

module.exports.getByUid = async (uid) => {
  const post = await Post.findOne({
    where: { uid },
    include: [Comment, Like, Localization, User, Photo],
  });
  if (!post) throw new CustomError(404, 'Not found post');

  return post;
};

module.exports.getByLocalization = async (uid) => {
  const posts = Localization.findOne({
    where: { uid },
    include: {
      model: Post,
      include: [
        { model: User, attributes: ['username', 'uid'] },
        Comment,
        Like,
      ],
    },
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
      { model: User, attributes: ['username', 'uid'] },
      Comment,
      Like,
      Photo,
    ],
  });

  return posts;
};

module.exports.add = async (postData, files, userUid) => {
  const localizationToAdd = {
    geometry: JSON.parse(postData.geometry),
    city: postData.city,
    categoryUid: postData.categoryUid,
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
    delete postToAdd.categoryUid;

    const post = await Post.create(postToAdd, { transaction: t });

    let savedPhoto = null;
    if (files.post) {
      const photo = await Photo.create(
        { filename: files.post[0].filename, postUid: post.uid },
        { transaction: t }
      );
      savedPhoto = photo;
    }

    return {
      ...post.dataValues,
      localization: localization.dataValues,
      filename: savedPhoto?.filename,
    };
  });

  return result;
};

module.exports.addToLocalization = async (postData, files, userUid) => {
  const result = await db.transaction(async (t) => {
    const post = await Post.create(
      { ...postData, userUid },
      { transaction: t }
    );
    console.log(files);
    let savedPhoto = null;
    if (files.post || files.video) {
      const photo = await Photo.create(
        { filename: files.post[0].filename, postUid: post.uid },
        { transaction: t }
      );
      savedPhoto = photo;
    }

    return { ...post, filename: savedPhoto?.filename };
  });

  return result;
};

module.exports.update = async (postData, userUid) => {
  const isAllowedTOUpdate = await isUserPostOwner(postData.uid, userUid);
  if (!isAllowedTOUpdate) throw new CustomError(400, 'Bad Request');

  await Post.update(postData, {
    where: { uid: postData.uid },
  });

  return postData;
};

module.exports.deleteByUid = async (postUid, userUid) => {
  const isAllowedToRemove = await isUserPostOwner(postUid, userUid);
  if (!isAllowedToRemove) throw new CustomError(400, 'Bad Request');

  const postToRemove = await Post.findOne({
    where: { uid: postUid },
    include: [Photo],
  });
  if (postToRemove.photos.length) {
    try {
      fs.unlinkSync(
        `${path.dirname(require.main.filename)}/pictures/post/${
          postToRemove.photos[0].filename
        }`
      );
    } catch (err) {
      console.log('file not exists');
    }
  }

  await Post.destroy({
    where: { uid: postUid },
  });
};
