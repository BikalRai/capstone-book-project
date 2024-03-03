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

// const getImgUrl = async (isbn) => {
//   try {
//     const result = await axios.get(
//       `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
//     );

//     return result.request.res.responseUrl;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

app.get('/', async (req, res) => {
  //get all the books and display
  try {
    const data = await db.query('SELECT * FROM books');

    // await getImgUrl('0-553-10354-7');

    // currentPage value to be passed to the ejs
    res.render('index.ejs', { currentPage: 'home', books: data.rows });
  } catch (error) {
    console.log(error.message);
  }
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

app.post('/add', async (req, res) => {
  const title = req.body.title;
  const desc = req.body.desc;
  const isbn = req.body.isbn;

  try {
    // try to get img cover url from api
    const imgUrl = await axios.get(
      `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
    );

    // insert one data to db
    await db.query(
      'INSERT INTO books (book_title, book_desc, book_isbn, book_img_url) VALUES ($1, $2, $3, $4);',
      [title, desc, isbn, imgUrl.request.res.responseUrl]
    );

    res.redirect('/');
  } catch (error) {
    console.log(error.message);
  }
});

// view the specifice book
app.get('/view', async (req, res) => {
  const bookId = req.query.bookId;

  try {
    const result = await db.query('SELECT * FROM books where id = $1', [
      bookId,
    ]);

    res.render(`viewBook.ejs`, { book: result.rows[0], currentPage: 'view' });
  } catch (error) {
    console.log(error.message);
  }
});

app.post('/del', async (req, res) => {
  const bookId = req.body.bookId;

  // console.log(bookId, 'delete');

  try {
    // delete query to delete book
    const result = await db.query(`DELETE FROM books WHERE id = $1`, [bookId]);

    // console.log(result, 'delete');
    res.redirect('/');
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
