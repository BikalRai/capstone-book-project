import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'book_db',
  password: '123456',
  port: 5432,
});
db.connect();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // currentPage value to be passed to the ejs
  res.render('index.ejs', { currentPage: 'home' });
});

app.get('/addBook', (req, res) => {
  // get the value of the button
  const back = req.query.return;

  // return back to homepage when clicking on the back button
  if (back === 'back') {
    res.redirect('/');
  }
  // currentPage value to be passed to the ejs
  res.render('addBook.ejs', { currentPage: 'add' });
});

app.post('/add', (req, res) => {
  const title = req.body.title;
  const desc = req.body.decs;
  const isbn = req.body.isbn;
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
