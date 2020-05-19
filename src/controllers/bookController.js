const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');


function bookController(nav) {

    const url = 'mongodb://localhost:27017';
    const dbName = "LibraryApp";
    let client;

    function getList(req, res) {
        (async function mongo() {
            try {
                client = await MongoClient.connect(url);
                debug('connected to the mongodb');

                const books = await client.db(dbName).collection('books').find().toArray();
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
            if (client) {
                client.close();
            }
        }());
    }

    function allId(req, res, next) {
        const { id } = req.params;
        (async function query() {
            try {
                client = await MongoClient.connect(url);
                let db = client.db(dbName);
                let col = db.collection('books');
                let book = await col.findOne({ _id: new ObjectID(id) });
                debug(book);
                req.book = book;
                next();
            } catch (err) {
                debug(err.stack);
            }
        }());
    }

    function getId(req, res) {
        res.render(
            'bookView',
            {
                nav,
                title: 'Library',
                book: req.book
            }
        );
    }

    function middleware(req, res, next) {
        // if (req.user) {
            next();
        // } else {
        //     res.redirect('/');
        // }
    }

    return {
        getList,
        allId,
        getId,
        middleware
    }

}

module.exports = bookController;