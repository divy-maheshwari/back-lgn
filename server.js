const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const DB = require('./config/keys').MONGOURI
const app = express();
mongoose.connect(DB,{ useNewUrlParser: true,useUnifiedTopology: true },() => {
    console.log('connected to DB');
});

app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use('/api/user',require('./routes/userRoute'))
app.use('/',(req,res) => {
    res.send("welcome divy");
})

port = process.env.PORT || 5000;
app.listen(port,() => {
    console.log(`server running at ${port}`);
});

module.exports = app;