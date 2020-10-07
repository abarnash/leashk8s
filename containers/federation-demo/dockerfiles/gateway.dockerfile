FROM node:latest

RUN mkdir gateway
COPY package.json ./package.json
RUN npm i

COPY gateway.js ./gateway.js

CMD node gateway.js
