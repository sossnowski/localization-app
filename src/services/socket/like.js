const Like = require('../../models/Like');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

module.exports.emitPostLikeUpdateEvent = async (io, data) => {
  const personGotLike = await Post.findOne({
    where: { uid: data.postUid },
    attributes: ['userUid'],
  });

  io.to(personGotLike.userUid).emit('postLikeUpdate', {
    actionOwner: data.actionUser.username,
    userUid: data.actionUser.uid,
    isUpVote: data.isUpVote,
    postUid: data.postUid,
  });

  io.sockets.in(`Loc_${data.localizationUid}`).emit('postLikeUpdate', {
    userUid: data.actionUser.uid,
    isUpVote: data.isUpVote,
    postUid: data.postUid,
  });
};

module.exports.emitPostLikeEvent = async (io, data) => {
  const personGotLike = await Post.findOne({
    where: { uid: data.like.postUid },
    attributes: ['userUid'],
  });

  io.to(personGotLike.userUid).emit('postLike', {
    actionOwner: data.actionUser.username,
    like: data.like,
  });

  io.sockets.in(`Loc_${data.localizationUid}`).emit('postLike', data.like);
};

module.exports.emitCommentLikeUpdateEvent = async (io, data) => {
  const comment = await Comment.findOne({
    where: { uid: data.commentUid },
    include: { model: Post, attributes: ['uid', 'userUid'] },
  });

  io.to(comment.post.userUid).emit('commentLikeUpdate', {
    actionOwner: data.actionUser.username,
    userUid: data.actionUser.uid,
    isUpVote: data.isUpVote,
    postUid: comment.post.uid,
    commentUid: comment.uid,
  });
};

module.exports.emitCommentLikeEvent = async (io, data) => {
  const comment = await Comment.findOne({
    where: { uid: data.like.commentUid },
    include: { model: Post, attributes: ['uid', 'userUid'] },
  });

  io.to(comment.post.userUid).emit('commentLike', {
    actionOwner: data.actionUser.username,
    like: data.like,
    postUid: comment.post.uid,
  });
};
