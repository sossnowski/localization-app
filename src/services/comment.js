const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

module.exports.isUserCommentOwner = async (commentUid, userUid) => {
  const comment = await Comment.findOne({
    where: {
      uid: commentUid,
    },
  });

  return comment?.userUid === userUid;
};

module.exports.removeRelatedNotifications = async (commentUid, t) => {
  await Notification.destroy(
    {
      where: {
        text: `commentUid:${commentUid}`,
      },
    },
    { transaction: t }
  );
};
