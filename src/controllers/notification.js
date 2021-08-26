const CustomError = require('../helpers/error');
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
    order: [['createdAt', 'desc']],
    group: 'text',
    limit: parseInt(process.env.NOTIFICATIONS_PER_PAGE),
  });
};

module.exports.setNotificationAsSeen = async (uid, userUid) => {
  const notification = await Notification.findOne({ where: { uid } });

  if (notification.targetUid !== userUid)
    throw new CustomError(400, 'Bad request');
  notification.new = false;
  await notification.save();
};
