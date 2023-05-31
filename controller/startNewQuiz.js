const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cassandra = require("cassandra-driver");
// const io = require('socket.io')(http, {
//     cors: {
//       origins: ['http://localhost:3001']
//     }
//   });
const datacenter = "datacenter1";
const contactPoints = ["localhost"];
dotenv.config();


const keyspace = "lsQuiz";

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: datacenter,
});


const StartNewQuiz = async (req,res) =>{
    const quizname = req.body.quizname;

    // io.on('connection', (socket) => {
    //     console.log('a user connected');
    //     socket.on('disconnect', () => {
    //       console.log('user disconnected');
    //     });
    // });



}

module.exports = StartNewQuiz;