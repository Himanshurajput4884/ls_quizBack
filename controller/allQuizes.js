const cassandra = require("cassandra-driver");
const datacenter = "datacenter1";
const contactPoints = ["localhost"];
const keyspace = "lsQuiz";
const table = "pendingQuiz";

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: datacenter,
});


const allQuizes = async (req, res) =>{
    try{
        client.connect().then(() => {
            console.log("Keyspace created or already exist");
            let useQuery = `USE ${keyspace}`;
            return client.execute(useQuery);
          })
          .then(async ()=>{
              return client.execute(`CREATE TABLE IF NOT EXISTS ${table} 
              (quizname text, choice1 text, choice2 text, choice3 text, prize text, PRIMARY KEY(quizname));`)
          })
          .then(async ()=>{
            const result= await client.execute(`SELECT * FROM ${table}`);
            return res.status(201).json({message:"Success", quizes: result.rows});
          })
    }
    catch(err){
        if(err){
            console.log("Error: ", err);
            return res.status(401).json({message: "Something went wrong"});
        }
    }
}

module.exports = allQuizes;