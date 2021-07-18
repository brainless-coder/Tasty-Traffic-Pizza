require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const url = "mongodb://localhost/pizza";
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...');
});


// Session store
let mongoStore = MongoDbStore.create({
                mongoUrl: url,
                collectionName: 'sessions'
            });

// Session config
app.use(session({
    // used for encrypting cookies
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    // yhape hamne cookie ki life declare ki h, maxAge cookie ka, ye milliseconds me time hota hai
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport Config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


// flash middleware ko use karne ke liye
app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    // agar apan ye next() waale callback ko call nhi karenge to apna request complete nhi hoga
    // and browser me wo gol gol ghumta rahega
    next();
});

// Set Template Engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');

// Routes
require('./routes/web')(app);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});