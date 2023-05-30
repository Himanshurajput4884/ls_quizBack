const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cassandra = require("cassandra-driver");
const datacenter = "datacenter1";
const contactPoints = ["localhost"];
dotenv.config();

const keyspace = "lsQuiz";

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: datacenter,
});


const registerUserQuiz = async(req, res)=>{
    try{
        const username = req.body.username;
        const quizname = req.body.quizname;

        const useKeyspace = await client.execute(`USE ${keyspace}`);

        const registerQuery = await client.execute(`INSERT INTO ${quizname} (quizname, username) VALUES (?, ?);`, [quizname, username]);

        // console.log(registerQuery);

        return res.status(201).json({message:"Quiz registration successfully"});

    }
    catch(err){
        console.log("Error: ", err);
        return res.status(401).json({message: "Something went wrong"});
    }
}

module.exports = registerUserQuiz;