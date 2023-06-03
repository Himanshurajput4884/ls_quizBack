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

const checkQuiz = async ( req, res )=>{
    try{
        const username = req.body.username;
        const quizname = req.body.quizname;
        await client.connect();
        await client.execute(`USE ${keyspace}`);
        const data = await client.execute(`SELECT * FROM ${username+"Quiz"} WHERE quizname=?;`,[quizname]);

        if(data.rows.length > 0){
            return res.status(201).json({message:"Have registered"});
        }
    }
    catch(err){
        console.log("Error: ", err);
        return res.status(401).json({message:"Something went wrong"});
    }
}


module.exports = checkQuiz;