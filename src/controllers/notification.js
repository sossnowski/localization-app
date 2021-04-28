const Notification = require('../models/Notification');

const numberPerPage = 3;

module.exports.getAll = (offset, userUid) => {
  const parsed = parseInt(offset);
  if (parsed) {
    return Notification.findAll({
      where: { targetUid: userUid },
      order: [['createdAt', 'desc']],
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
