const cassandra = require("cassandra-driver");
const datacenter = "datacenter1";
const contactPoints = ["localhost"];
const keyspace = "lsQuiz";
const table = "pendingQuiz";

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: datacenter,
});

function getRandomlyChoosenQuestions(array, count) {
    if (!Array.isArray(array)) {
        throw new Error('The "array" parameter must be an array.');
      }

  if (count >= array.length) {
    return array;
  }

  const copyArray = array.slice();

  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * copyArray.length);
    result.push(copyArray.splice(randomIndex, 1)[0]);
  }

  return result;
}

function getRandomQuestionBank(arr1, arr2, arr3) {
  const result = [];



  const questionBank1 = getRandomlyChoosenQuestions(arr1, 8);
  const questionBank2 = getRandomlyChoosenQuestions(arr2, 8);
  const questionBank3 = getRandomlyChoosenQuestions(arr3, 8);

  result.push(...questionBank1, ...questionBank2, ...questionBank3);

  return result;
}

const getResultInArray = (result) =>{
    console.log(result);
    const rows = result.rows.map(row => {
        const obj = {};
        for (const column of result.columns) {
          obj[column.name] = row[column.name];
        }
        return obj;
      });
      return rows;
}

const newQuiz = async (req, res) => {
  try {
    const { quizname, choice1, choice2, choice3, prize, date, time } = req.body;

    console.log(quizname);

    await client.connect();
    console.log("Keyspace created or already exist");

    let useQuery = `USE ${keyspace}`;
    await client.execute(useQuery);

    await client.execute(
      `CREATE TABLE IF NOT EXISTS ${table} (quizname text, choice1 text, choice2 text, choice3 text, prize text, date text, time text, PRIMARY KEY(quizname));`
    );

    const result = await client.execute(
      `INSERT INTO ${table} (quizname, choice1, choice2, choice3, prize, date, time) VALUES (?,?,?,?,?,?,?);`,
      [quizname, choice1, choice2, choice3, prize, date, time]
    );

    await client.execute(
      `CREATE TABLE IF NOT EXISTS ${quizname} (quizname text, username text, PRIMARY KEY((quizname,username)));`
    );

    
    const choicesTable1 = (await client.execute(`SELECT * FROM ${choice1}`));
    const choicesTable2 = (await client.execute(`SELECT * FROM ${choice2}`));
    const choicesTable3 = (await client.execute(`SELECT * FROM ${choice3}`));
    
    const questionBank1 = (getResultInArray(choicesTable1));
    const questionBank2 = (getResultInArray(choicesTable2));
    const questionBank3 = (getResultInArray(choicesTable3));

        // console.log("ChoiceTable: ",getResultInArray(choicesTable1));

    await client.execute(
      `CREATE TABLE IF NOT EXISTS ${
        quizname + "QuestionTable"
      } (question text, answer text, opt1 text, opt2 text, opt3 text, PRIMARY KEY(question));`
    );

      const result4 = await client.execute(`SELECT * FROM ${quizname + "QuestionTable"};`);

      if(result4.rows.length === 0){
        let resultQuestionTable =getRandomQuestionBank(questionBank1,questionBank2,questionBank3);
    
        // console.log(resultQuestionTable);
    
          resultQuestionTable.map(async(v)=>{
            await client.execute(`INSERT INTO ${quizname + "QuestionTable"} (question,answer,opt1,opt2,opt3) VALUES (?,?,?,?,?)`,[v.question, v.answer, v.opt1, v.opt2, v.opt3])
          });
      }


    return res.status(201).json({ message: "Quiz created." });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(401).json({ message: "Something went wrong" });
  }
};

module.exports = newQuiz;
