const Like = require('../models/Like');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Localization = require('../models/Localization');
const CustomError = require('../helpers/error');
const { isUserPostOwner } = require('../services/post');

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

module.exports.add = async (postData, userUid) => {
  const postToAdd = { ...postData, userUid };
  const post = await Post.create(postToAdd);

  return post;
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

  await Post.destroy({
    where: { uid: postUid },
  });
};
