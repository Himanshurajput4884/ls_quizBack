const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cassandra = require("cassandra-driver");
const datacenter = "datacenter1";
const contactPoints = ["localhost"];
dotenv.config();

const keyspace = "lsQuiz";
const table = "userDetails";
const table2 = "pendingQuiz";

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: datacenter,
});



const checkEligibility = async (req, res) => {
  try {
    const username = req.body.username;
    const quizname = req.body.quizname;

    console.log(username);
    console.log(quizname);

    await client.connect();

    console.log("Keyspace created or already exist");
    let useQuery = `USE ${keyspace}`;
    await client.execute(useQuery);

    const userChoices = await client.execute(`SELECT * FROM ${table} WHERE username=?`, [username]);
    const quizSubjects = await client.execute(`SELECT * FROM ${table2} WHERE quizname=?`, [quizname]);

    const userChoicesObj = Object.values(userChoices.rows[0]);
    const quizSubjectsObj = Object.values(quizSubjects.rows[0]);

    // console.log(userChoicesObj);
    // console.log(quizSubjectsObj);

    if (!userChoicesObj.includes(quizSubjects[1]) || !userChoicesObj.includes(quizSubjects[2]) || !userChoicesObj.includes(quizSubjects[3])) {
      console.log("Not eligible");
      return res.status(401).json({ message: "Not eligible." });
    } else {
      console.log("Eligible");
      return res.status(201).json({ message: "Eligible" });
    }
  } catch (err) {
    console.log("Error: ", err);
    return res.status(401).json({ message: "Something went wrong" });
  }
};

module.exports = checkEligibility;