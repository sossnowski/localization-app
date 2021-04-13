const multer = require('multer');
const mime = require('mime');
const Post = require('../models/Post');

module.exports.isUserPostOwner = async (postUid, userUid) => {
  const post = await Post.findOne({
    where: {
      uid: postUid,
    },
  });

  return post?.userUid === userUid;
};

module.exports.postExists = async (uid) => {
  const post = await Post.findOne({ where: { uid } });

  return !!post;
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(req.files);
    cb(null, `./pictures/${file.fieldname}/`);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}_${uniqueSuffix}.${mime.getExtension(file.mimetype)}`
    );
  },
});

const upload = multer({ storage });
const cpUpload = upload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'post', maxCount: 1 },
]);

module.exports.fileUploader = cpUpload;
