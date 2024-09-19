#!/bin/bash

cd /home/node/app

if [ ! -f .env ]; then
  yarn install &&
  yarn run copyAssets &&
  yarn run compileAll &&
  touch .env
fi

yarn run startServer