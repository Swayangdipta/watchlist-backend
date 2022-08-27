const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Route imports

const contentRoutes = require('./routes/content')
const userRoutes = require('./routes/user')

// Database connection
mongoose.connect(process.env.DB_URI,{useNewUrlParser: true,useUnifiedTopology: true})
.then(res=> console.log("DB Connected"))
.catch(err=>console.log("DATABASE CONNECTION FAILD: ",err));

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api',contentRoutes);
app.use('/api',userRoutes);
// Some Changes

const PORT = process.env.PORT || 9000;

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})