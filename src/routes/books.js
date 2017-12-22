import express from 'express';
import authenticate from '../middlewares/authenticate';
import request from 'request-promise';
import { parseString } from 'xml2js';
import parseErrors from '../utils/parseErrors';
import Book from '../models/Book';

const router = express.Router();
router.use(authenticate);

router.get('/', (req, res) => {
  Book.find({ userId: req.currentUser._id }).then(books => res.json({ books }));
})

router.post('/', (req, res) => {
  Book.create({ ...req.body.book, userId: req.currentUser._id }).then(book => {
    res.json({ book })
  }).catch(err => {
   res.status(400).json({ errors: parseErrors(err.errors) });
  })
});

router.get("/fetchPages", (req, res) => {
  const goodreadsId = req.query.goodreadsId;

  request.get(`https://www.goodreads.com/book/show.xml?key=${process.env
      .GOODREADS_KEY}&id=${goodreadsId}`)
    .then(result => parseString(result, (err, goodreadResult) => {
      const numPages = goodreadResult.GoodreadsResponse.book[0].num_pages[0];
      const pages = numPages ? parseInt(numPages, 10) : 0;
      res.json({
        pages: pages
      })
    })

  );
});

router.get("/search", (req, res) => {
  request.get(`https://www.goodreads.com/search/index.xml?key=${process.env
      .GOODREADS_KEY}&q=${req.query.q}`)
    .then(result =>
      parseString(result, (err, goodreadResult) =>
        res.json({
          books: goodreadResult.GoodreadsResponse.search[0].results[0].work.map(work => ({
            goodreadsId: work.best_book[0].id[0]._,
            title: work.best_book[0].title[0],
            authors: work.best_book[0].author[0].name[0],
            covers: [work.best_book[0].image_url[0]]
        }))}
      )
    )
  );
});

export default router;