const {Worker, Worker}= require('bullmq');
const db =  require('../config/db');

const {userQueue , connection} = require('../queue/userqueue')

const Worker = new Worker(
    'userQueue',
     async(job)=>{
         const { email, password } = job.data;
     },
     {connection}
)
Worker.on('completed', ()=>{
     console.log(" worker completed ");
});
Worker.on('failed',()=>{
     console.log("worker failed ");
})
