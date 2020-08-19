FROM node:12.18-buster-slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . /usr/src/app

CMD ["npm", "start"]