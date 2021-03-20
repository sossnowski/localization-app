const Like = require('../models/Like');

module.exports.setLike = async (postUid, isUpVote, userUid) => {
  await Like.update(
    { isUpVote },
    {
      where: {
        userUid,
        postUid,
      },
    }
  );
};

module.exports.addLike = async (postUid, isUpVote, userUid) =>
  Like.create(
    { isUpVote, postUid, userUid },
    {
      where: {
        userUid,
        postUid,
      },
    }
  );
