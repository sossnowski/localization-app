const admin = require('firebase-admin');

const serviceAccount = require('./spotfinderFcm.json');

const SUBTITLES = {
  en: {
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
  },
  pl: {
    user_: 'Użytkownik',
    and_: 'i',
    other_: 'inny',
    others_: 'innych',
    reactComment_: 'zareagował na twój komentarz',
    reactCommentPlural_: 'zareagowali na twój komentarz',
    reactPost_: 'zareagował na twój post',
    reactPostPlural_: 'zareagowali na twój post',
    commented_: 'skomentował twój post',
    commentedPlural_: 'skomentowali twój post',
  },
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

const isThereMoreUsersReacted = (number, lang) => {
  const subtitles = SUBTITLES[lang];
  if (number === 1) return '';
  if (number === 2)
    return `${subtitles.and_} ${number - 1} ${subtitles.other_}`;
  return `${subtitles.and_} ${number - 1} ${subtitles.others_}`;
};

const generateNotificationText = (notification, lang) => {
  const type = notification.text.split(':')[0];
  const subtitles = SUBTITLES[lang];

  switch (type) {
    case 'commentUid':
      return `${subtitles.user_} ${
        notification.username
      } ${isThereMoreUsersReacted(notification.number, lang)} ${
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

module.exports.sendNotification = async (notification, recipentData) => {
  const { mobileToken, configuration } = recipentData;
  const lang = configuration?.language || 'pl';
  if (!mobileToken || !notification) return;
  const message = {
    mobileToken,
    notification: {
      title: 'SpotFinder!',
      body: generateNotificationText(notification, lang),
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
