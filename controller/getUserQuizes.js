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


const getUserQuizes = async (req, res)=>{
    const username = req.body.username;

    const table = username+"Quiz";

    try{
        await client.connect();

        await client.execute(`USE ${keyspace}`);

        const response = await client.execute(`SELECT * FROM ${ table }`);

        console.log(response.rows);

        return res.status(201).json({message:"success", quiz:response.rows});
    }
    catch(err){
        console.log("Error: ", err);
    }
}

module.exports = getUserQuizes;