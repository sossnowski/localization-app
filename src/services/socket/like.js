const Like = require('../../models/Like');
const Post = require('../../models/Post');

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
};
