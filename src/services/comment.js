const Comment = require('../models/Comment');

module.exports.isUserCommentOwner = async (commentUid, userUid) => {
  const comment = await Comment.findOne({
    where: {
      uid: commentUid,
    },
  });

  return comment?.userUid === userUid;
};
