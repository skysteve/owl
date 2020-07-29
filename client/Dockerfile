FROM node:12
WORKDIR /client

# dependencies will be installed only if the package files change
COPY . .

RUN yarn

# start app
CMD ["yarn", "start"]