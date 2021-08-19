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
const Emitter = require('events');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const url = "mongodb://localhost/pizza";
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
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

// Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

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
app.use(express.static(__dirname + '/public'));
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


const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


// Socket 
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    // Join a private room, har order ke liye ek room bnayenge
    socket.on('join', (roomName) => {
        // ye socket ka join method haame uss room me join karwa deta hai
        socket.join(roomName);
    });
});

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
})