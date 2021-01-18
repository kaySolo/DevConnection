const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const user = require('./route/api/user');
const profile = require('./route/api/profile');
const posts = require('./route/api/posts');


const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false}));


// db config
const db = require('./config/keys').mongoURI;

// connect to mongoDB by mongoose
mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));



// app.get('/', (req, res) => res.send("Hello world! I am Yash :)"));

// passport initialise
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

app.use('/api/user/', user);
app.use('/api/profile/', profile);
app.use('/api/posts/', posts);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
})
