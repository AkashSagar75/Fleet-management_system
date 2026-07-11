const {Queue} = require('bullmq');

const connection = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
}
const userQueue = new Queue(
    "UserQueue",
    {
        connection
    }
);

module.exports = {userQueue, connection};