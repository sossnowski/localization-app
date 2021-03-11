const Comment = require('../models/Comment');
const CustomError = require('../helpers/error');
const { postExists } = require('../services/post');
const { isUserCommentOwner } = require('../services/comment');

module.exports.getPostComments = async (postUid) => {
  const comments = await Comment.findAll({ where: { postUid } });

  return comments;
};

module.exports.add = async (commentData, userUid) => {
  const { postUid } = commentData;
  const isPostExists = await postExists(postUid);
  if (!isPostExists) throw new CustomError(400, 'Bad Request');

  const postToAdd = { ...commentData, userUid, postUid };
  const comment = await Comment.create(postToAdd);

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
