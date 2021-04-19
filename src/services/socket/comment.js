const Post = require('../../models/Post');

module.exports.emitCommentEvent = async (io, data) => {
  const commentedPostOwner = await Post.findOne({
    where: { uid: data.comment.postUid },
    attributes: ['userUid'],
  });

  if (commentedPostOwner.userUid === data.actionUser.uid) return;
  io.to(commentedPostOwner.userUid).emit('addComment', {
    actionOwner: data.actionUser.username,
    comment: { ...data.comment.dataValues, likes: [] },
  });

  io.sockets
    .in(`Loc_${data.localizationUid}`)
    .emit('addComment', { ...data.comment.dataValues, likes: [] });
};
