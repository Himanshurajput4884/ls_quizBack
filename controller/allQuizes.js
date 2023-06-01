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
  try {
    await client.connect();
    console.log("Keyspace created or already exist");
    let useQuery = `USE ${keyspace}`;
    await client.execute(useQuery);
  
    await client.execute(`CREATE TABLE IF NOT EXISTS ${table} 
      (quizname text, choice1 text, choice2 text, choice3 text, prize text, date text, time text, PRIMARY KEY(quizname));`);
  
    const result = await client.execute(`SELECT * FROM ${table}`);
    console.log(result.rows);
    return res.status(201).json({ message: "Success", quizes: result.rows });
  } catch (err) {
    if (err) {
      console.log("Error: ", err);
      return res.status(401).json({ message: "Something went wrong" });
    }
  }
}

module.exports = allQuizes;