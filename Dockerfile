FROM node:0.10.36

RUN apt-get update && apt-get install -y libavahi-compat-libdnssd-dev

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD [ "npm", "start" ]
