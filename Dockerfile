FROM node:14-alpine

WORKDIR /home/app 

COPY package*.json .
COPY yarn.lock .
COPY server.js .

RUN yarn install --frozen-lockfile
COPY . .

CMD ["yarn", "start"]