const cassandra = require("cassandra-driver");
const datacenter = "datacenter1";
const contactPoints = ["localhost"];
const keyspace = "lsQuiz";
const table = "pendingQuiz";

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: datacenter,
});

const newQuiz = async(req, res)=>{
    try{
        const { quizname, choice1, choice2, choice3, prize } = req.body;

        // console.log(req.body);
        console.log(quizname);

        client.connect().then(() => {
            console.log("Keyspace created or already exist");
            let useQuery = `USE ${keyspace}`;
            return client.execute(useQuery);
          })
          .then(()=>{
              return client.execute(`CREATE TABLE IF NOT EXISTS ${table} 
              (quizname text, choice1 text, choice2 text, choice3 text, prize text, PRIMARY KEY(quizname));`)
          })
          .then(async ()=>{
            const result = await client.execute(`INSERT INTO ${table} (quizname, choice1, choice2, choice3, prize) VALUES (?,?,?,?,?);`, [quizname, choice1, choice2, choice3, prize])
            
            client.execute(`CREATE TABLE IF NOT EXISTS ${quizname} (quizname text, username text, PRIMARY KEY((quizname,username)));`)
            .then(()=>{

            })
            .catch((err)=>{
                console.log("Error in creating new table: ", err);
            })
            
          })

        
        return res.status(201).json({message: "Quiz created."});

    }
    catch(err){
        if(err){
            console.log("Error: ", err);
            return res.status(401).json({message:"Something went wrong"});
        }
    }

}

module.exports = newQuiz;