FROM node:14.15.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/back

COPY package.json .
RUN npm install

COPY . .
EXPOSE 8000

CMD [ "node", "server.js" ]