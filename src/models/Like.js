const Sequelize = require('sequelize');
const db = require('../config/db');

const Like = db.define('like', {
  uid: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  isUpVote: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Like;

Like.afterCreate(async (like, option) => {
  if (like.postUid) {
    const post = await like.getPost();
    if (like.isUpVote) post.likesNumber += 1;
    else post.dislikesNumber += 1;
    await post.save({ transaction: option.transaction });
  } else if (like.commentUid) {
    const comment = await like.getComment();
    if (like.isUpVote) comment.likesNumber += 1;
    else comment.dislikesNumber += 1;
    await comment.save({ transaction: option.transaction });
  } else if (like.tripUid) {
    const trip = await like.getTrip();
    if (like.isUpVote) trip.likesNumber += 1;
    else trip.dislikesNumber += 1;
    await trip.save({ transaction: option.transaction });
  }
});

Like.afterUpdate(async (like, option) => {
  console.log(like.postUid, like.isUpVote);
  if (like.postUid) {
    const post = await like.getPost();
    if (like.isUpVote) {
      post.likesNumber += 1;
      post.dislikesNumber -= 1;
    } else {
      post.likesNumber -= 1;
      post.dislikesNumber += 1;
    }
    await post.save({ transaction: option.transaction });
  } else if (like.commentUid) {
    const comment = await like.getComment();
    if (like.isUpVote) {
      comment.likesNumber += 1;
      comment.dislikesNumber -= 1;
    } else {
      comment.dislikesNumber += 1;
      comment.likesNumber -= 1;
    }
    await comment.save({ transaction: option.transaction });
  } else if (like.tripUid) {
    const trip = await like.getTrip();
    if (like.isUpVote) {
      trip.likesNumber += 1;
      trip.dislikesNumber -= 1;
    } else {
      trip.dislikesNumber += 1;
      trip.likesNumber -= 1;
    }
    await trip.save({ transaction: option.transaction });
  }
});
