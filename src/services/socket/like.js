const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {
  postLike,
  postLikeUpdate,
  commentLike,
  commentLikeUpdate,
} = require('../notifications/main');

module.exports.emitPostLikeUpdateEvent = async (io, data) => {
  const personGotLike = await Post.findOne({
    where: { uid: data.postUid },
    attributes: ['userUid'],
  });

  const notification = await postLikeUpdate({
    isUpVote: data.isUpVote,
    postUid: data.postUid,
    actionUser: data.actionUser.uid,
  });

  if (personGotLike.userUid !== data.actionUser.uid)
    io.to(personGotLike.userUid).emit('notification', notification);

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

  const notification = await postLike(
    {
      username: data.actionUser.username,
      isUpVote: data.like.isUpVote,
      postUid: data.like.postUid,
    },
    data.actionUser.uid,
    personGotLike.userUid
  );
  if (personGotLike.userUid !== data.actionUser.uid)
    io.to(personGotLike.userUid).emit('notification', notification);

  io.sockets.in(`Loc_${data.localizationUid}`).emit('postLike', data.like);
};

module.exports.emitCommentLikeUpdateEvent = async (io, data) => {
  const comment = await Comment.findOne({
    where: { uid: data.commentUid },
    include: { model: Post, attributes: ['uid', 'userUid'] },
  });

  const notification = await commentLikeUpdate({
    isUpVote: data.isUpVote,
    commentUid: comment.uid,
    actionUser: data.actionUser.uid,
  });

  if (comment.userUid !== data.actionUser.uid)
    io.to(comment.userUid).emit('notification', notification);

  io.sockets.in(`Loc_${data.localizationUid}`).emit('commentLikeUpdate', {
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

  const notification = await commentLike(
    {
      username: data.actionUser.username,
      isUpVote: data.like.isUpVote,
      commentUid: comment.uid,
    },
    data.actionUser.uid,
    comment.userUid
  );

  if (comment.userUid !== data.actionUser.uid)
    io.to(comment.userUid).emit('notification', notification);

  io.sockets.in(`Loc_${data.localizationUid}`).emit('commentLike', {
    like: data.like,
    postUid: comment.post.uid,
  });
};
