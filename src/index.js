// Create a website that allows people to post messages to a page. A message consists of a title and a body.
// The site should have two pages:
// - The first page shows people a form where they can add a new message.
// - The second page shows each of the messages people have posted.
// Make sure there's a way to navigate the site so users can access each page.

// Messages must be stored in a postgres database. Create a "messages" table with three columns:
// column name / column data type:
// - id: serial primary key
// - title: text
// - body: text

// Additional Grading Criteria

// As before, your package.json must include the correct dependencies.

// Additionally, you must configure postgres as follows:
// Name your database "bulletinboard".
// Your postgres username must be read from an environment variable named "POSTGRES_USER".
// Your postgres password (if present) must be read from an environment variable named "POSTGRES_PASSWORD"

// Thus, your connection string in the code will appear as follows:

// var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
// set an environment variable by opening either ~/.bash_profile for OSX or ~/.bashrc for Linux and adding the line:

// export POSTGRES_USER=jon
// export POSTGRES_PASSWORD=mypassword
// After that, restart your terminal to propagate these changes to your shell.

// This will allow Lindsey to grade your assignments without having to go into your code and change your connection string to his configuration.

const express = require('express');
const index = express();

const bodyParser = require('body-parser')
index.use(bodyParser.urlencoded({
    extended: false
}));


const {
    Client
} = require('pg');
const client = new Client({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: 'bulletinboard',
    port: 5432
});


client.connect()

const ejs = require('ejs');
index.set('view engine', 'ejs');
index.set('views', './src/views');

index.use(express.static('./public'));

index.listen(7000, () => {
    console.log('Hi! Listening on 7000!');
});

// adding posts
index.get('/', (req, res) => {
    res.render('page1');
});

index.post('/', (req, res) => {
    var title = req.body.title;
    var comment = req.body.comment;
    client.query('insert into messages (title, body) values ($1, $2)', [title, comment], (err, result) => {
        if (err) {
            console.log(err.stack);
            res.status(500).send('Connection failed!');
        } else {
            res.status(200).send('Added with sucess!');
        }
    })

});


// showing messages
index.get('/posts', (req, res) => {
    client.query('select * from messages', (err, result) => {
        err ? console.log(err.stack) : result.rows
        var data = result.rows;
        res.render('page2', {
            data: data
        });
    });
});