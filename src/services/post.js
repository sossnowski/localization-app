const multer = require('multer');
const mime = require('mime');
const { Op } = require('sequelize');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

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
    console.log(file, 'oo');
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

const upload = multer({
  storage,
  limits: { fileSize: 30000000 },
});
const cpUpload = upload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

module.exports.fileUploader = cpUpload;

module.exports.removeRelatedNotifications = async (postUid, t) => {
  await Notification.destroy(
    {
      where: {
        text: {
          [Op.or]: [
            `postUid:${postUid}`,
            `addComment:${postUid}`,
            `tripUid:${postUid}`,
          ],
        },
      },
    },
    { transaction: t }
  );
};
