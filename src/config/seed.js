module.exports.users = [
  {
    username: 'test1',
    email: 'email1@op.pl',
    password: 'test1',
  },
  {
    username: 'test2',
    email: 'email2@op.pl',
    password: 'test2',
  },
];

module.exports.categories = [
  {
    name: 'Zabytki',
  },
  {
    name: 'Rekreacja',
  },
];

module.exports.posts = [
  {
    title: 'title1',
    description: 'desc1',
    localization: { type: 'Point', coordinates: [0, 0] },
  },
  {
    title: 'title2',
    description: 'desc2',
    localization: { type: 'Point', coordinates: [0, 1] },
  },
];

module.exports.likes = [
  { isUpVote: true },
  { isUpVote: false },
  { isUpVote: true },
  { isUpVote: false },
];

module.exports.comments = [
  {
    text: 'test',
  },
  {
    text: 'test2',
  },
];
