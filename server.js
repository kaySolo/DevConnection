const express = require('express');
const mongoose = require('mongoose');

const user = require('./route/api/user');
const profile = require('./route/api/profile');
const posts = require('./route/api/posts');


// db config
const db = require('./config/keys').mongoURI;

// connect to mongoDB by mongoose
mongoose
    .connect(db)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

const app = express();

app.get('/', (req, res) => res.send("Hello world! I am Yash :)"));

app.use('/api/user/', user);
app.use('/api/profile/', profile);
app.use('/api/posts/', posts);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
})
