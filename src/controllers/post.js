const fs = require('fs');
const path = require('path');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Localization = require('../models/Localization');
const CustomError = require('../helpers/error');
const {
  isUserPostOwner,
  removeRelatedNotifications,
} = require('../services/post');
const db = require('../config/db');
const Photo = require('../models/Photo');
const {
  getLocalizationNameByCoordinates,
} = require('../services/localization');

const POSTS_PER_REQEST = 10;

module.exports.getAll = async () => {
  const posts = await Post.findAll({
    include: [Category, User, Comment, Like],
  });

  return posts;
};

module.exports.getByUid = async (uid) => {
  const post = await Post.findOne({
    where: { uid },
    include: [
      { model: User, attributes: ['uid', 'username'] },
      { model: Localization, attributes: ['uid', 'geometry'] },
      {
        model: Comment,
        attributes: ['uid', 'text', 'createdAt'],
        include: [
          { model: Like, attributes: ['isUpVote', 'uid', 'userUid'] },
          { model: User, attributes: ['uid', 'username'] },
        ],
      },
      { model: Photo, attributes: ['uid', 'filename'] },
      { model: Like, attributes: ['uid', 'isUpVote', 'userUid'] },
    ],
  });
  if (!post) throw new CustomError(404, 'Not found post');

  return post;
};

module.exports.getFromLocalization = async (localization, offset) => {
  const parsed = parseInt(offset);
  const posts = await Post.findAll({
    include: [
      {
        model: Localization,
        where: {
          uid: localization,
        },
      },
      { model: User, attributes: ['username', 'uid'] },
      { model: Like, attributes: ['uid', 'userUid', 'isUpVote'] },
      Photo,
    ],
    order: [
      ['likesNumber', 'desc'],
      ['commentNumber', 'desc'],
    ],
    offset: parsed || 0,
    limit: parseInt(POSTS_PER_REQEST),
  });

  return posts;
};

module.exports.getFromLocalizationTimeOrder = async (localization, offset) => {
  const parsed = parseInt(offset);
  const posts = await Post.findAll({
    include: [
      {
        model: Localization,
        where: {
          uid: localization,
        },
      },
      { model: User, attributes: ['username', 'uid'] },
      { model: Like, attributes: ['uid', 'userUid', 'isUpVote'] },
      Photo,
    ],
    order: [['createdAt', 'desc']],
    offset: parsed || 0,
    limit: parseInt(POSTS_PER_REQEST),
  });

  return posts;
};

module.exports.getBestPosts = async (offset) => {
  const parsed = parseInt(offset);
  const posts = await Post.findAll({
    include: [
      {
        model: Localization,
      },
      { model: User, attributes: ['username', 'uid'] },
      { model: Like, attributes: ['uid', 'userUid', 'isUpVote'] },
      Photo,
    ],
    order: [
      ['likesNumber', 'desc'],
      ['commentNumber', 'desc'],
    ],
    offset: parsed || 0,
    limit: parseInt(POSTS_PER_REQEST),
  });

  return posts;
};

module.exports.getNewestPosts = async (offset) => {
  const parsed = parseInt(offset);
  const posts = await Post.findAll({
    include: [
      {
        model: Localization,
      },
      { model: User, attributes: ['username', 'uid'] },
      { model: Like, attributes: ['uid', 'userUid', 'isUpVote'] },
      Photo,
    ],
    order: [['createdAt', 'desc']],
    offset: parsed || 0,
    limit: parseInt(POSTS_PER_REQEST),
  });

  return posts;
};

module.exports.add = async (postData, files, userUid) => {
  const geometry = JSON.parse(postData.geometry);
  if (!postData.city || postData.city === '')
    postData.city = await getLocalizationNameByCoordinates(
      geometry.coordinates
    );
  const localizationToAdd = {
    geometry,
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
    if (files.image || files.video) {
      const fileToSave = files.image || files.video;
      const photo = await Photo.create(
        { filename: fileToSave[0].filename, postUid: post.uid },
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
    const post = (
      await Post.create({ ...postData, userUid }, { transaction: t })
    ).get({ plain: true });
    let savedPhoto = null;
    if (files.image || files.video) {
      const fileToSave = files.image || files.video;
      const photo = await Photo.create(
        { filename: fileToSave[0].filename, postUid: post.uid },
        { transaction: t }
      );
      savedPhoto = photo;
    }

    return { ...post, filename: savedPhoto?.filename };
  });

  return this.getByUid(result.uid || null);
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
    include: [Photo, Localization],
  });
  const localization = await Localization.findOne({
    where: { uid: postToRemove.localizationUid },
    include: [{ model: Post, attributes: ['uid'] }],
  });

  await db.transaction(async (t) => {
    await Post.destroy(
      {
        where: { uid: postUid },
      },
      { transaction: t }
    );

    await removeRelatedNotifications(postToRemove.uid, t);

    if (localization.posts.length === 1)
      await Localization.destroy(
        {
          where: { uid: localization.uid },
        },
        { transaction: t }
      );

    if (postToRemove.photos.length) {
      try {
        fs.unlinkSync(
          `${path.dirname(require.main.filename)}/pictures/${
            postToRemove.photos[0].filename.split('_')[0]
          }/${postToRemove.photos[0].filename}`
        );
      } catch (err) {
        console.log(err);
      }
    }
  });
};
