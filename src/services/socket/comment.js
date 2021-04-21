const Post = require('../../models/Post');
const { addComment } = require('../notifications/main');

module.exports.emitCommentEvent = async (io, data) => {
  const commentedPostOwner = await Post.findOne({
    where: { uid: data.comment.postUid },
    attributes: ['userUid'],
  });

  if (commentedPostOwner.userUid === data.actionUser.uid) return;

  const notification = await addComment(
    {
      username: data.actionUser.username,
      commentUid: data.comment.dataValues.uid,
    },
    data.actionUser.uid,
    commentedPostOwner.userUid
  );

  io.to(commentedPostOwner.userUid).emit('notification', notification);

  io.sockets
    .in(`Loc_${data.localizationUid}`)
    .emit('addComment', { ...data.comment.dataValues, likes: [] });
};
