FROM node:13

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
# start app
CMD ["npm", "run", "start"]