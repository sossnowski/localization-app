const Post = require('../models/Post');

module.exports.isUserPostOwner = async (postUid, userUid) => {
  const post = await Post.findOne({
    where: {
      uid: postUid,
    },
  });

  return post?.userUid === userUid;
};

module.exports.postExists = async (uid) => {
  const post = await Post.findOne({ where: { uid } });

  return !!post;
};
