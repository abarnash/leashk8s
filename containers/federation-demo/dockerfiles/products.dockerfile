FROM node:latest

RUN mkdir products
COPY package.json ./package.json
COPY lerna.json ./lerna.json
RUN npm i

COPY services/products ./services/products

CMD cd services/products && node index.js
