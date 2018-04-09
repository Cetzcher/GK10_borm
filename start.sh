#!/bin/sh
DOCKER_IMG="mongo_nodeapp_prieger"
docker build -t $DOCKER_IMG .
npm install
npm rebuild
docker run -d -p 28000:27017  $DOCKER_IMG
npm start
