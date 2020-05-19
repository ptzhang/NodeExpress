const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');


const bookRouter = express.Router();

function router(nav) {

    bookRouter.use((req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    });

    const url = 'mongodb://localhost:27017';
    const dbName = "LibraryApp";
    let client;

    bookRouter.route('/')
        .get((req, res) => {
            (async function mongo() {
                try {
                    client = await MongoClient.connect(url);
                    debug('connected to the mongodb server');

                    let books = await client.db(dbName).collection('books').find().toArray();
                    res.render(
                        'bookListView',
                        {
                            nav,
                            title: 'Library',
                            books
                        }
                    );
                } catch (err) {
                    debug(err.stack);
                }
                client.close();
            }());
        });

    bookRouter.route('/:id')
        .all((req, res, next) => {
            const { id } = req.params;
            (async function query() {
                try {
                    client = await MongoClient.connect(url);
                    let db = client.db(dbName);
                    let col = await db.collection('books');
                    let book = await col.findOne({ _id: new ObjectID(id) });
                    debug(book);
                    req.book = book;
                    next();
                } catch (err) {
                    debug(err.stack);
                }
            }());
        })
        .get((req, res) => {
            res.render(
                'bookView',
                {
                    nav,
                    title: 'Library',
                    book: req.book
                }
            );
        });

    return bookRouter;
}

// module.exports = bookRouter;
module.exports = router;