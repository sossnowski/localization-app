const db = require('../config/db');
const seed = require('../config/seed');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Category = require('../models/Category');

module.exports.forceInit = async () => {
  await db.sync({ force: true });
  const users = await User.bulkCreate(seed.users);
  const posts = [];
  const categories = await Category.bulkCreate(seed.categories);

  for (const user of users) {
    for (const post of seed.posts) {
      post.userUid = user.uid;
      post.categoryUid = categories[0].uid;
      const result = await Post.create(post);
      posts.push(result);
    }
  }

  for (const post of posts) {
    for (const comment of seed.comments) {
      comment.postUid = post.uid;
      comment.userUid = users[0].uid;
      const result = await Comment.create(comment);
      Like.create({
        ...seed.likes[2],
        userUid: users[0].uid,
        commentUid: result.uid,
      });
    }
  }

  let like = seed.likes[0];
  like.userUid = users[0].uid;
  like.postUid = posts[0].uid;
  Like.create(like);
  like = seed.likes[1];
  like.userUid = users[1].uid;
  like.postUid = posts[1].uid;
  Like.create(like);
};
