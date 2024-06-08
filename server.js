// const mongoose=require("mongoose");
// const app = require('./app.js')

// // const url = "mongodb+srv://ashu0021:$_PASSWORD_$@cluster0.feswn1l.mongodb.net/$_DB_NAME_$?retryWrites=true&w=majority&appName=Cluster0"
// const uri ="mongodb://127.0.0.1:27017/Ai-Backend";

// // const dbUser ='ashu0021';
// // const dbPass='ashu1234';
// // const dbName='Image-Backend'
// // let dbLink=url.replace("$_USERNAME_$",dbUser);
// //     dbLink=dbLink.replace("$_PASSWORD_$",dbPass);
// //     dbLink=dbLink.replace("$_DB_NAME_$",dbName);

//     // console.log("dbLink :- "+dbLink)

//     mongoose.connect(uri)
//     .then(()=>console.log('______DB connected_____'))

// app.listen(1400,()=>{
//     console.log("http://localhost:1400")
// })

const mongoose = require("mongoose");
const app = require("./app.js");

const url =
  "mongodb+srv://ashu7225:pass1234@cluster0.axqlvbt.mongodb.net/Ai-Backend?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url).then(() => {
  console.log("-------- Database Connected --------");
});

app.listen(1400, () => {
  console.log("----------- App Started : http://localhost:1400/ -----------");
});
