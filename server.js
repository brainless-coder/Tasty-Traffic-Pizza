// yhape apna ek function import ho gya h express ka
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// apan ne express function ko call karke app variable ke andar store kiya
const app = express();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.render('home');
});

// Set Template Engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});