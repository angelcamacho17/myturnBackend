const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4005;

let Turn = require('./routes/Turn');
let User = require('./routes/User');

app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false 
    })
)

mongoose.connect('mongodb://127.0.0.1:27017/myturn', { useNewUrlParser: true })
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.log(err));

const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use('/users',User);
app.use('/turns', Turn);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});