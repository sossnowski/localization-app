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
  if (like.postUid) {
    const post = await like.getPost();
    if (like.isUpVote) post.likesNumber += 1;
    else post.dislikesNumber += 1;
  } else {
    const comment = await like.getComment();
    if (like.isUpVote) comment.likesNumber += 1;
    else comment.dislikesNumber += 1;
  }
});

Like.afterUpdate(async (like, options) => {
  if (like.postUid) {
    const post = await like.getPost();
    if (like.isUpVote) {
      post.likesNumber += 1;
      post.dislikesNumber -= 1;
    } else {
      post.likesNumber -= 1;
      post.dislikesNumber += 1;
    }
  } else {
    const comment = await like.getComment();
    if (like.isUpVote) {
      comment.likesNumber += 1;
      comment.dislikesNumber -= 1;
    } else {
      comment.dislikesNumber += 1;
      comment.likesNumber -= 1;
    }
  }
});
