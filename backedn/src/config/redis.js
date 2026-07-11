const redis = require('redis');

const client = redis.createClient({
    socket:{
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})
client.connect();
client.on("connect", () => {
    console.log("Redis Connected");
});
client.on('failed',()=>{
    console.log("redis connection failed")
})
module.exports = client;