const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');
const CustomError = require('../helpers/error');
const { postExists } = require('../services/post');
const { isUserCommentOwner } = require('../services/comment');
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
  const comment = await Comment.findOne({
    where: { uid: commentUid },
    include: [
      {
        model: Post,
        include: [
          Localization,
          User,
          Like,
          Photo,
          { model: Comment, include: [Like] },
        ],
      },
    ],
  });

  return comment;
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

  await Comment.destroy({
    where: { uid: commentUid },
  });
};

module.exports.getLikes = async (commentUid) => {
  console.log(commentUid);
  const likes = await Like.findAll({ where: { commentUid } });

  return likes;
};
