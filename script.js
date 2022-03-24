const Notification = require('./src/models/Notification');
const Notification2 = require('./src/models/Notification2');

module.exports.migrateData = async () => {
  await Notification2.destroy({});
  const groupedNotifications = await Notification.findAll({
    group: ['text'],
    raw: true,
  });
  console.log(groupedNotifications);
  for (const notify of groupedNotifications) {
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
    // const uidsToRemove = all.map((a) => a.uid);
    // await Notification.destroy({ where: { uid: uidsToRemove } });
  }
  // const result = await Notification2.findAll({});
};
