const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const dbConnect = require('./Utils/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/auth');
const imageRoutes = require('./Routes/image')
const {isAuthenticated} = require('./Middleware/isAuthenticated')
 
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

// Enable CORS for all routes
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // frontend address
  credentials: true // Allow cookies to be sent
}));  

dbConnect();

app.get('/', (req, res) => {
  res.send("Home");
});

app.use('/api/auth', authRoutes);
app.use('/image', imageRoutes);
app.use('/getuser',isAuthenticated, (req,res)=>{
  res.status(200).json(req.user)
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
