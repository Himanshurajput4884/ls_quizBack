const express = require("express");
const cors = require("cors");
const router = require("./apis/routes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connection = require("./db/db");
const socketIo = require("socket.io");
const cassandra = require("cassandra-driver");
const datacenter="datacenter1";
const contactPoints = ['localhost'];
const keyspace = "lsQuiz";
dotenv.config();

const client = new cassandra.Client({
    contactPoints: contactPoints,
    localDataCenter: datacenter,
});

const createKeyspace = async ()=>{
    client.connect()
    .then(()=>{
        console.log("Connected to Cassandra.");

        const createKeyspaceQuery = `
        CREATE KEYSPACE IF NOT EXISTS ${keyspace} 
        WITH replication = {
            'class': 'SimpleStrategy',
            'replication_factor': 1
        };
        `;
          return client.execute(createKeyspaceQuery);
        })
        .then(()=>{
            return client.execute(`USE ${keyspace}`);
        })
        .then(()=>{
            client.shutdown();
        })
        .catch((err)=>{
            console.log("Error: ", err);
        })
}

createKeyspace();

const app = express();
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000", "http://localhost:3001");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(cookieParser());


app.use(router);

const PORT = 8008;
const server = app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
})

const io = socketIo(server);

const questions = getQuestions();

let currQuesIndex = 0;
let quizStarted = false;

const shouldStartQuiz = (dateString, timeString) => {
    const targetDate = new Date(dateString);
    const targetTime = new Date(`2000-01-01T${timeString}`);
    const currentTime = new Date();
  
    return (
      currentTime >= targetDate &&
      currentTime.getHours() === targetTime.getHours() &&
      currentTime.getMinutes() === targetTime.getMinutes()
      );
    }
    

const getQuestions = async ()=>{
    await client.connect();
    await client.execute(`USE ${keyspace}`);
    const response = await client.execute(`SELECT * FROM pendingQuiz`);
    if(response.rows.length === 0){
        return [];
    }
    const quizes = response.rows;
    quizes.map( async (v)=>{
        if(shouldStartQuiz(v.date, v.time) === true){
            const questions = await client.execute(`SELECT * FROM ${v.quizname+"QuestionTable"}`);
            return questions.rows;
        }
    })
    return [];
}

const startQuiz = () =>{
    quizStarted = true;

    io.emit('question', questions[currQuesIndex]);

    io.on('answer', (data)=>{
        const currQuestion = questions[currQuesIndex];
        if(data.answer === currQuestion.answer){

        }
        else{

        }
        currQuesIndex++;
        if(currQuesIndex < questions.length){
            io.emit('question', questions[currQuesIndex]);
        }
        else{
            io.emit('game over');
        }
    })

}

io.on('connection', (socket)=>{
    console.log("a client connected...");
    socket.emit("Quiz will start in 5 minutes.");
    if(quizStarted){
        socket.emit('Quiz started');
    }
    else if(questions.length > 0){
        setTimeout(()=>{
            startQuiz();              
        }, 5*60*1000);
    }

    socket.on('disconnect', ()=>{
        console.log("A client disconnect.");
    })
})
