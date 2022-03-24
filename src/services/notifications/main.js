const Notification = require('../../models/Notification');

module.exports.postLike = async (data, from, to) => {
  const notification = await Notification.findOne({
    where: { text: `postUid:${data.postUid}`, userUid: to },
  });
  if (notification) {
    notification.number += 1;
    notification.new = true;
    notification.username = data.username;
    notification.save();

    return notification;
  }

  const newNotification = await Notification.create({
    userUid: to,
    text: `postUid:${data.postUid}`,
    username: data.username,
  });

  return newNotification;
};

module.exports.commentLike = async (data, from, to) => {
  const notification = await Notification.findOne({
    where: { text: `commentUid:${data.commentUid}`, userUid: to },
  });
  if (notification) {
    notification.number += 1;
    notification.new = true;
    notification.username = data.username;
    notification.save();

    return notification;
  }

  const newNotification = await Notification.create({
    userUid: to,
    text: `commentUid:${data.commentUid}`,
    username: data.username,
  });

  return newNotification;
};

module.exports.addComment = async (data, from, to) => {
  const notification = await Notification.findOne({
    where: { text: `addComment:${data.commentUid}`, userUid: to },
  });
  if (notification) {
    notification.number += 1;
    notification.new = true;
    notification.username = data.username;
    notification.save();

    return notification;
  }

  const newNotification = await Notification.create({
    userUid: to,
    text: `addComment:${data.commentUid}`,
    username: data.username,
  });

  return newNotification;
};
