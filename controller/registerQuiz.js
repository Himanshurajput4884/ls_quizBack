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



const registerQuiz = async (req, res) =>{
    const quizname = req.body.quizname;
    const username = req.body.username;
    console.log(req.body);
    try{
        await client.connect();

        await client.execute(`USE ${keyspace}`);

        await client.execute(`CREATE TABLE IF NOT EXISTS ${username+"Quiz"} (quizname text, choice1 text, choice2 text, choice3 text, prize text, date text, time text, PRIMARY KEY(quizname));;`);

        const result = await client.execute(`SELECT * FROM pendingquiz WHERE quizname=?`, [quizname]);

        await client.execute(`INSERT INTO ${quizname} (username, quizname) VALUES (?,?)`, [username, quizname]);
        console.log(result.rows[0].choice1);
        await client.execute(`INSERT INTO ${username+"Quiz"} (quizname, choice1, choice2, choice3, prize, date, time) VALUES (?,?,?,?,?,?,?)`, [quizname, result.rows[0].choice1,  result.rows[0].choice2, result.rows[0].choice3, result.rows[0].prize, result.rows[0].date, result.rows[0].time]);

        return res.status(201).json({message:"Register for quiz"});
    }
    catch(err){
        console.log("Error: ", err);
        return res.status(401).json({message:"Something went wrong"});
    }
}


module.exports = registerQuiz;