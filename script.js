const Notification = require('./src/models/Notification');
const Notification2 = require('./src/models/Notification2');
const { getPostByComment } = require('./src/controllers/comment');

module.exports.migrateData = async () => {
  await Notification2.destroy({ where: {} });
  const groupedNotifications = await Notification.findAll({
    group: ['text'],
    raw: true,
  });
  for (const notify of groupedNotifications) {
    if (notify.text.includes('addComment')) {
      const comment = await getPostByComment(notify.text.split(':')[1]);
      console.log(comment.postUid);
      const notification = await Notification2.findOne({
        where: {
          text: `addComment:${comment.postUid}`,
        },
      });
      if (notification) {
        notification.number += 1;
        notification.new = true;
        notification.username = notify.username;
        notification.save();
      } else {
        await Notification2.create({
          userUid: notify.targetUid,
          text: `addComment:${comment.postUid}`,
          username: notify.username,
        });
      }
    } else {
      const all = await Notification.findAll({
        where: { text: notify.text },
        raw: true,
      });
      await Notification2.create({
        text: notify.text,
        number: all.length,
        username: all[all.length - 1].username,
        userUid: notify.targetUid,
        new: true,
      });
    }
    // const uidsToRemove = all.map((a) => a.uid);
    // await Notification.destroy({ where: { uid: uidsToRemove } });
  }
  // const result = await Notification2.findAll({});
};
