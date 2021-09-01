FROM node:15-alpine

ENV NODE_ENV production

WORKDIR /spotfinder

COPY . /spotfinder/

RUN npm install

CMD node index.js
