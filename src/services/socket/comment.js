const Post = require('../../models/Post');
const User = require('../../models/User');
const { addComment } = require('../notifications/main');
const { sendNotification } = require('../notifications/pushNotifications');

module.exports.emitCommentEvent = async (io, data) => {
  const commentedPostOwner = await Post.findOne({
    where: { uid: data.comment.postUid },
    attributes: ['userUid'],
    include: { model: User, attributes: ['mobileToken'] },
  });

  if (commentedPostOwner.userUid === data.actionUser.uid) return;

  const notification = await addComment(
    {
      username: data.actionUser.username,
      postUid: data.comment.postUid,
    },
    commentedPostOwner.userUid
  );
  sendNotification(notification, commentedPostOwner.user);
  io.to(commentedPostOwner.userUid).emit('notification', notification);

  io.sockets
    .in(`Loc_${data.localizationUid}`)
    .emit('addComment', { ...data.comment.dataValues, likes: [] });
};
