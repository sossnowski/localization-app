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

module.exports.getPostComments = async (postUid) => {
  const comments = await Comment.findAll({
    where: { postUid },
    include: [{ model: User, attributes: ['username', 'uid'] }, Like],
  });

  return comments;
};

module.exports.getPostByComment = async (commentUid) => {
  const post = await Comment.getPost({
    where: { uid: commentUid },
    include: [
      { model: User, attributes: ['uid', 'username'] },
      {
        model: Comment,
        attributes: ['uid', 'text', 'createdAt'],
        include: [{ model: Like, attributes: ['isUpVote', 'uid', 'userUid'] }],
      },
      { model: Photo, attributes: ['uid', 'filename'] },
      { model: Like, attributes: ['uid', 'isUpVote', 'userUid'] },
    ],
  });
  if (!post) throw new CustomError(404, 'Not found post');

  return post;
};

module.exports.add = async (commentData, userUid) => {
  const { postUid } = commentData;
  const isPostExists = await postExists(postUid);
  if (!isPostExists) throw new CustomError(400, 'Bad Request');

  const commentToAdd = { ...commentData, userUid };
  const comment = await Comment.create(commentToAdd);

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
  const comment = await Comment.findOne({
    where: { uid: commentUid },
    raw: true,
  });

  await db.transaction(async (t) => {
    await postExists.save;
    await Comment.destroy(
      {
        where: { uid: commentUid },
      },
      { transaction: t }
    );
    Post.decrement(
      'commentNumber',
      { where: { uid: comment.postUid } },
      { transaction: t }
    );
    await removeRelatedNotifications(commentUid, t);
  });
};

module.exports.getLikes = async (commentUid) => {
  const likes = await Like.findAll({ where: { commentUid } });

  return likes;
};
