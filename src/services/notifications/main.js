const Notification = require('../../models/Notification');

module.exports.postLike = async (data, from, to) => {
  const notification = await Notification.create({
    isUpVote: data.isUpVote,
    userUid: from,
    targetUid: to,
    text: `postUid:${data.postUid}`,
    username: data.username,
  });

  return notification;
};

module.exports.postLikeUpdate = async (data) => {
  const notification = await Notification.findOne({
    where: { text: `postUid:${data.postUid}`, userUid: data.actionUser },
  });
  if (!notification) return null;
  notification.isUpVote = data.isUpVote;
  notification.new = true;
  notification.save();

  return notification;
};

module.exports.commentLike = async (data, from, to) => {
  const notification = await Notification.create({
    isUpVote: data.isUpVote,
    userUid: from,
    targetUid: to,
    text: `commentUid:${data.commentUid}`,
    username: data.username,
  });

  return notification;
};

module.exports.commentLikeUpdate = async (data) => {
  console.log(data);
  const notification = await Notification.findOne({
    where: { text: `commentUid:${data.commentUid}`, userUid: data.actionUser },
  });
  if (!notification) return null;
  notification.isUpVote = data.isUpVote;
  notification.new = true;
  notification.save();

  return notification;
};

module.exports.addComment = async (data, from, to) => {
  const notification = await Notification.create({
    userUid: from,
    targetUid: to,
    text: `addComment:${data.commentUid}`,
    username: data.username,
  });

  return notification;
};
