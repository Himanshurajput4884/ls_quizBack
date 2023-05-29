const cassandra = require("cassandra-driver");
const fs = require('fs');
const { type } = require("os");
const datacenter="datacenter1";
const contactPoints = ['localhost'];
const keyspace = "lsquiz";
const table = "World_war1";

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: datacenter,
});

const InsertData = async(v) =>{
    client.connect()
    .then(()=>{
        return client.execute(`USE ${keyspace}`);
    })
    .then(()=>{
      const query = `INSERT INTO ${table} (question, opt1, opt2, opt3, answer) VALUES (?, ?, ?, ?, ?);`;
      return client.execute(query, [v["ques"], v["opt1"], v["opt2"], v["opt3"], v["answer"]])
    })
    .then(()=>{
      console.log("Complete");
    })
    .catch((err)=>{
      console.log("Error: ", err);
    })
}
// Read the JSON file
fs.readFile("../Data/World War I.json", 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
//   console.log(data);
  
  client.connect()
  .then(()=>{
    return client.execute(`USE ${keyspace}`);
  })
  .then(()=>{
    const query = `CREATE TABLE ${table} (question text PRIMARY KEY, opt1 text, opt2 text, opt3 text, answer text);`;
    return client.execute(query)
  })
  .then(()=>{
    console.log("Table is created");
  })
  .catch((err)=>{
    console.log("error: ", err);
  })



const res = JSON.parse(data);
res.map((v)=>{
    InsertData(v);
    // console.log(v["ques"]);
  })




});

