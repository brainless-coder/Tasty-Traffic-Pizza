const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Assets
app.use(express.static('public'));

// Set Template Engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');

// Routes
require('./routes/web')(app);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});