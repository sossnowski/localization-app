const Notification = require('../models/Notification2');

const NOTIFICATIONS_PER_PAGE = 10;

module.exports.getAll = (offset, userUid) => {
  const parsed = parseInt(offset);
  if (parsed) {
    return Notification.findAll({
      where: { userUid },
      order: [['updatedAt', 'desc']],
      offset: parsed,
      limit: parseInt(NOTIFICATIONS_PER_PAGE),
    });
  }

  return Notification.findAll({
    where: { userUid },
    order: [['updatedAt', 'desc']],
    limit: parseInt(NOTIFICATIONS_PER_PAGE),
  });
};

module.exports.setNotificationAsSeen = async (uid) =>
  Notification.update(
    { new: false },
    {
      where: { uid },
      silent: true,
    }
  );
