FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN mkdir /api-boticario

WORKDIR /api-boticario
COPY . /api-boticario
RUN chmod 755 ./scripts/wait-for-it.sh
RUN chmod 755 ./scripts/migrate.sh
RUN npm install -g nodemon
RUN npm install
RUN npm audit fix

EXPOSE 3000/tcp
CMD ["npm","start"]