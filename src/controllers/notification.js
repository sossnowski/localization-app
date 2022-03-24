const Notification = require('../models/Notification2');
require('dotenv').config();

module.exports.getAll = (offset, userUid) => {
  const parsed = parseInt(offset);
  if (parsed) {
    return Notification.findAll({
      where: { userUid },
      order: [['updatedAt', 'desc']],
      offset: parsed,
      limit: parseInt(process.env.NOTIFICATIONS_PER_PAGE),
    });
  }

  return Notification.findAll({
    where: { userUid },
    order: [['updatedAt', 'desc']],
    limit: parseInt(process.env.NOTIFICATIONS_PER_PAGE),
  });
};

module.exports.setNotificationAsSeen = async (uid) =>
  Notification.update(
    { new: false },
    {
      where: { uid },
    },
    { silent: true }
  );
