const fs = require('fs');

const filename = "World War I.json";
// Read file synchronously
let res = "";
try {
  const data = fs.readFileSync(`${filename}`, 'utf8');
  console.log(typeof(data));
  const modifiedString = data.replace(/'/g, '"');
// console.log(modifiedString);

const modifiedString2 = modifiedString.replace(/\b(ques|opt1|opt2|opt3|answer)\b/g, (match) => `"${match}"`);
res = modifiedString2;
// console.log(modifiedString2);
  
} catch (error) {
  console.error('Error reading file:', error);
}



const write = () =>{
    setTimeout(()=>{

    }, 2000);
    fs.writeFile(`${filename}`, res, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('File write operation complete.');
        }
      });


}

write();