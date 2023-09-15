const db = require('../config/db');
const CustomError = require('../helpers/error');
const Like = require('../models/Like');

module.exports.setLike = async (postUid, isUpVote, userUid) => {
  await Like.update(
    { isUpVote },
    {
      where: {
        userUid,
        postUid,
      },
      individualHooks: true,
    }
  );
};

module.exports.addLike = async (postUid, isUpVote, userUid) => {
  const result = await Like.findOne({ where: { postUid, userUid } });
  if (result) throw new CustomError(400, 'Bad Request');

  return Like.create({ isUpVote, postUid, userUid });
};

module.exports.setCommentLike = async (commentUid, isUpVote, userUid) => {
  await Like.update(
    { isUpVote },
    {
      where: {
        userUid,
        commentUid,
      },
      individualHooks: true,
    }
  );
};

module.exports.addCommentLike = async (commentUid, isUpVote, userUid) => {
  const result = await Like.findOne({ where: { commentUid, userUid } });
  if (result) throw new CustomError(400, 'Bad Request');
  return Like.create({ isUpVote, commentUid, userUid });
};

module.exports.setTripLike = async (tripUid, isUpVote, userUid) => {
  const transaction = await db.transaction();
  await Like.update(
    { isUpVote },
    {
      where: {
        userUid,
        tripUid,
      },
      individualHooks: true,
      transaction,
    }
  );
  await transaction.commit();
};

module.exports.addTripLike = async (tripUid, isUpVote, userUid) => {
  const result = await Like.findOne({ where: { tripUid, userUid } });
  if (result) throw new CustomError(400, 'Bad Request');
  const transaction = await db.transaction();
  const like = await Like.create(
    { isUpVote, tripUid, userUid },
    { transaction }
  );
  await transaction.commit();

  return like;
};
