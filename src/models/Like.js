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

Like.afterCreate(async (like, options) => {
  const updateObj = like.isUpVote
    ? { likesNumber: Sequelize.literal('likesNumber + 1') }
    : { dislikesNumber: Sequelize.literal('dislikesNumber + 1') };

  if (like.postUid) like.setPost(updateObj);
  else if (like.commentUid) like.setComment(updateObj);
});

Like.afterUpdate(async (like, options) => {
  const updateObj = like.isUpVote
    ? {
        likesNumber: Sequelize.literal('likesNumber + 1'),
        dislikesNumber: Sequelize.literal('dislikesNumber - 1'),
      }
    : {
        dislikesNumber: Sequelize.literal('dislikesNumber + 1'),
        likesNumber: Sequelize.literal('likesNumber - 1'),
      };
  if (like.postUid) like.setPost(updateObj);
  else if (like.commentUid) like.setComment(updateObj);
});
