## Description

This is POC of a Notification system using NestJS, Bull and Cron.

## Installation

In order to use the app you need  to have a redis instance, you can execute the next commando to create a docker image

```bash
$ docker run -d -p 6379:6379 --name redis-notifications redis
```
Also you need to set your .env file with the next structure

```bash
REDIS_HOST=localhost
REDIS_PORT=6379

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SNS_TOPIC_ARN=
``` 
Install the dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
