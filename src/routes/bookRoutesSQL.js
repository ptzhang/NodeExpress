const express = require('express');
const sql = require("mssql");
const debug = require('debug')('app:bookRoutes');


const bookRouter = express.Router();

function router(nav) {

    const config = {
        user: 'library',
        password: 'Password#',
        server: 'pslibrary1234.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
        database: 'library',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };
    sql.connect(config).catch(err => debug(err));
    debug('sql connected');

    bookRouter.route('/')
        .get((req, res) => {
            (async function query() {
                const request = new sql.Request();
                const { recordset } = await request.query('select * from books');
                res.render(
                    'bookListView',
                    {
                        nav,
                        title: 'Library',
                        books: recordset
                    }
                );
            }());
            // //promis
            // const request = new sql.Request();
            // request.query('select * from books')
            //     .then(result => {
            //         debug(result);
            //         res.render(
            //             'bookListView',
            //             {
            //                 nav,
            //                 title: 'Library',
            //                 books: result.recordset
            //             }
            //         )
            //     })
        });

    bookRouter.route('/:id')
        .all((req, res, next) => {
            //const id = req.params.id;
            const { id } = req.params;
            //res.send('books get s');
            (async function query() {
                const request = new sql.Request();
                const { recordset } = await request.input('id', sql.Int, id).query('select * from books where id = @id');

                //req.book = recordset[0];
                [req.book] = recordset;
                next();
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