const Notification = require('../models/Notification');
require('dotenv').config();

module.exports.getAll = (offset, userUid) => {
  const parsed = parseInt(offset);
  if (parsed) {
    return Notification.findAll({
      where: { targetUid: userUid },
      order: [['updatedAt', 'desc']],
      group: 'text',
      offset: parsed,
      limit: parseInt(process.env.NOTIFICATIONS_PER_PAGE),
    });
  }

  return Notification.findAll({
    where: { targetUid: userUid },
    order: [['updatedAt', 'desc']],
    // group: 'text',
    limit: parseInt(process.env.NOTIFICATIONS_PER_PAGE),
  });
};

module.exports.setNotificationAsSeen = async (uid, userUid) =>
  Notification.update(
    { new: false },
    {
      where: { uid, targetUid: userUid },
    }
  );

module.exports.setAllCommentNotificationsAsSeen = async (uid, userUid) =>
  Notification.update(
    { new: false },
    {
      where: { text: `commentUid:${uid}`, targetUid: userUid },
    }
  );

module.exports.setAllPostNotificationsAsSeen = async (uid, userUid) =>
  Notification.update(
    { new: false },
    {
      where: { text: `postUid:${uid}`, targetUid: userUid },
    }
  );
