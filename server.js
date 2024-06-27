const mongoose = require("mongoose");
const app = require("./app.js");
require('dotenv').config()
const PORT = process.env.PORT;

const url =process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("-------- Database Connected --------");
});

app.listen(PORT, () => {
  console.log(`----------- App Started : ${process.env.DEV_URL} -----------`);
});
