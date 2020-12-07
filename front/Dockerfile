FROM node:14.15.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/front

COPY package.json .
RUN npm install

COPY . .

CMD [ "yarn", "start" ]