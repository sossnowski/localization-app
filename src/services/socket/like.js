const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');
const { postLike, commentLike } = require('../notifications/main');
const { sendNotification } = require('../notifications/pushNotifications');

module.exports.emitPostLikeEvent = async (io, data) => {
  const personGotLike = await Post.findOne({
    where: { uid: data.like.postUid },
    attributes: ['userUid'],
    include: { model: User, attributes: ['mobileToken'] },
  });

  if (personGotLike.userUid !== data.actionUser.uid) {
    const notification = await postLike(
      {
        username: data.actionUser.username,
        isUpVote: data.like.isUpVote,
        postUid: data.like.postUid,
      },
      personGotLike.userUid
    );
    sendNotification(notification, personGotLike.user.mobileToken);
    io.to(personGotLike.userUid).emit('notification', notification);
  }

  io.sockets.in(`Loc_${data.localizationUid}`).emit('postLike', data.like);
};

module.exports.emitCommentLikeEvent = async (io, data) => {
  const comment = await Comment.findOne({
    where: { uid: data.like.commentUid },
    include: [
      { model: Post, attributes: ['uid', 'userUid'] },
      { model: User, attributes: ['mobileToken'] },
    ],
  });

  if (comment.userUid !== data.actionUser.uid) {
    const notification = await commentLike(
      {
        username: data.actionUser.username,
        isUpVote: data.like.isUpVote,
        commentUid: comment.uid,
      },
      comment.userUid
    );
    sendNotification(notification, comment.user.mobileToken);
    io.to(comment.userUid).emit('notification', notification);
  }

  io.sockets.in(`Loc_${data.localizationUid}`).emit('commentLike', {
    like: data.like,
    postUid: comment.post.uid,
  });
};
