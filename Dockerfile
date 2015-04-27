FROM google/nodejs
RUN npm install -g forever
WORKDIR /app

ADD package.json /app/
RUN npm install

ADD . /app
CMD []

EXPOSE  3000
ENTRYPOINT npm install && NODE_ENV = ${env} forever server.js
