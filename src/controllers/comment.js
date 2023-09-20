const { Op } = require('sequelize');

const db = require('../config/db');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');
const CustomError = require('../helpers/error');
const { postExists } = require('../services/post');
const {
  isUserCommentOwner,
  removeRelatedNotifications,
} = require('../services/comment');
const Post = require('../models/Post');
const Photo = require('../models/Photo');
const Localization = require('../models/Localization');
const { tripExists } = require('../services/trip');

const COMMENTS_PER_REQEST = 10;

module.exports.getComments = async (parentUid, offset) => {
  const parsed = parseInt(offset);
  const comments = await Comment.findAll({
    where: {
      [Op.or]: [{ postUid: parentUid }, { tripUid: parentUid }],
    },
    include: [{ model: User, attributes: ['username', 'uid'] }, Like],
    order: [['likesNumber', 'desc']],
    offset: parsed || 0,
    limit: parseInt(COMMENTS_PER_REQEST),
  });

  return comments;
};

module.exports.getPostByComment = async (commentUid) => {
  const comment = await Comment.findOne({
    where: { uid: commentUid },
  });
  const post = await comment.getPost({
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

module.exports.add = async (commentData, userUid) => {
  const transaction = await db.transaction();
  const commentToAdd = { ...commentData, userUid };
  const comment = await Comment.create(commentToAdd, { transaction });
  await transaction.commit();

  return comment;
};

module.exports.update = async (commentData, userUid) => {
  const isAllowedTOUpdate = await isUserCommentOwner(commentData.uid, userUid);
  if (!isAllowedTOUpdate) throw new CustomError(400, 'Bad Request');

  await Comment.update(commentData, {
    where: { uid: commentData.uid },
  });

  return commentData;
};

module.exports.deleteByUid = async (commentUid, userUid) => {
  const isAllowedToRemove = await isUserCommentOwner(commentUid, userUid);
  if (!isAllowedToRemove) throw new CustomError(400, 'Bad Request');

  await db.transaction(async (t) => {
    await Comment.destroy(
      {
        where: { uid: commentUid },
        individualHooks: true,
      },
      { transaction: t }
    );
    await removeRelatedNotifications(commentUid, t);
  });
};

module.exports.getLikes = async (commentUid) => {
  const likes = await Like.findAll({ where: { commentUid } });

  return likes;
};
