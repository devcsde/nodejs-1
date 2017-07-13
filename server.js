/**
 * Created by csche on 12.07.2017.
 */
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// middleware erweitert oder bietet zusatzinfos zu modulen, oder routinen
// haben immer eine function mit (req, res, next)
// müssen mit next() abgeschlossen werden.
app.use((req, res, next) => {
    let now = new Date().toString();

    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);

// datei schreiben mit fs.appendfile, 3 argumente
// (filename, conten, (err) => { })
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// maintainence page stops everything else from executing
// its a middleware that is NOT terminated with next();
app.use((req, res, next) => {
    res.render('maintenance')
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res)=>{

    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: `Welcome to my website!`
    })

    //res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Chris',
    //     likes: ['biking', 'cities', 'dogs', 'italian food']
    // })
});

app.get('/about', (req, res)=>{
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res)=>{
    res.send({
        errorMessage: 'unable to handle request'
    });
});

// for heroku we set a variable to port
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});