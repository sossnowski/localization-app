const admin = require('firebase-admin');

const serviceAccount = require('./spotfinderFcm.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

const generateNotificationText = (notification) => {
  const type = notification.text.split(':')[0];
  const subtitles = {
    user_: 'Użytkownik',
    likeComment_: 'lubi twój komentarz',
    notLikeComment_: 'nie lubi twojego komentarza',
    likePost_: 'lubi twój post',
    notLikePost_: 'nie lubi twojego postu',
    commented_: 'skomentował twój post',
    showMore_: 'Pokaż więcej',
    noItems_: 'Nie masz powiadomień',
  };
  switch (type) {
    case 'commentUid':
      return `${subtitles.user_} ${notification.username} ${
        notification.isUpVote
          ? subtitles.likeComment_
          : subtitles.notLikeComment_
      }`;
    case 'postUid':
      return `${subtitles.user_} ${notification.username} ${
        notification.isUpVote ? subtitles.likePost_ : subtitles.notLikePost_
      }`;

    case 'addComment':
      return `${subtitles.user_} ${notification.username} ${subtitles.commented_} `;
    default:
      return 'nieznany';
  }
};

module.exports.sendNotification = async (notification, token) => {
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

  return messaging.send(message);
};
