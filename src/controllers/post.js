const Like = require('../models/Like');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');

module.exports.getAll = async () => {
  const posts = await Post.findAll({
    include: [Category, User, Comment, Like],
  });

  return posts;
};

module.exports.getByCategory = async (category) => {
  //   const posts = await Post.findAll({
  //     include: [{ model: Category, as: 'categories' }, User, Comment, Like],
  //     where: { 'categories.name': category },
  //   });
  const posts = await Category.findOne({
    include: [
      {
        model: Post,
        include: [User, Comment, Like],
      },
    ],
    where: { name: category },
  });

  return posts;
};
