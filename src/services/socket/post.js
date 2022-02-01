const Like = require('../../models/Like');
const Photo = require('../../models/Photo');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');

module.exports.emitPostEvent = async (io, post) => {
  const postFromDB = await Post.findOne({
    where: { uid: post.uid },
    include: [User, Like, Comment, Photo],
  });

  if (!postFromDB) return;
  io.to(`Loc_${post.localizationUid}`).emit('addPost', postFromDB);
};
