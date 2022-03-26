const admin = require('firebase-admin');

const serviceAccount = require('./spotfinderFcm.json');

const subtitles = {
  user_: 'User',
  and_: 'and',
  other_: 'other',
  others_: 'others',
  reactComment_: 'reacted to your comment',
  reactCommentPlural_: 'reacted to your comment',
  reactPost_: 'reacted to your post',
  reactPostPlural_: 'reacted to your post',
  commented_: 'commented your post',
  commentedPlural_: 'commented your post',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

const isThereMoreUsersReacted = (number) => {
  if (number === 1) return '';
  if (number === 2)
    return `${subtitles.and_} ${number - 1} ${subtitles.other_}`;
  return `${subtitles.and_} ${number - 1} ${subtitles.others_}`;
};

const generateNotificationText = (notification) => {
  const type = notification.text.split(':')[0];

  switch (type) {
    case 'commentUid':
      return `${subtitles.user_} ${
        notification.username
      } ${isThereMoreUsersReacted(notification.number)} ${
        notification.number > 1
          ? subtitles.reactCommentPlural_
          : subtitles.reactComment_
      }`;
    case 'postUid':
      return `${subtitles.user_} ${
        notification.username
      } ${isThereMoreUsersReacted(notification.number)} ${
        notification.number > 1
          ? subtitles.reactPostPlural_
          : subtitles.reactPost_
      }`;

    case 'addComment':
      return `${subtitles.user_} ${
        notification.username
      } ${isThereMoreUsersReacted(notification.number)} ${
        notification.number > 1
          ? subtitles.commentedPlural_
          : subtitles.commented_
      } `;
    default:
      return 'nieznany';
  }
};

module.exports.sendNotification = async (notification, token) => {
  if (!token || !notification) return;
  const message = {
    token,
    notification: {
      title: 'SpotFinder!',
      body: generateNotificationText(notification),
    },
    data: {
      value: notification.text,
      uid: notification.uid,
    },
  };
  try {
    messaging.send(message);
  } catch (e) {
    console.log('push notify error');
  }
};
