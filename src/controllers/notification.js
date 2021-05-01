const CustomError = require('../helpers/error');
const Notification = require('../models/Notification');

const numberPerPage = 3;

module.exports.getAll = (offset, userUid) => {
  const parsed = parseInt(offset);
  if (parsed) {
    return Notification.findAll({
      where: { targetUid: userUid },
      order: [['updatedAt', 'desc']],
      offset: parsed,
      limit: numberPerPage,
    });
  }
  return Notification.findAll({
    where: { targetUid: userUid },
    order: [['createdAt', 'desc']],
    limit: numberPerPage,
  });
};

module.exports.setNotificationAsSeen = async (uid, userUid) => {
  const notification = await Notification.findOne({ where: { uid } });

  if (notification.targetUid !== userUid)
    throw new CustomError(400, 'Bad request');
  notification.new = false;
  await notification.save();
};
