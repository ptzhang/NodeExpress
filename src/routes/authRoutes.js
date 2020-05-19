const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

function router(nav) {

    const authRouter = express.Router();

    authRouter.route('/signUp')
        .get((req, res) => {
            res.render('signup', {
                nav,
                title: 'Sign Up'
            });
        })
        .post((req, res) => {
            //debug(req.body);
            //res.json(req.body);

            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = "LibraryApp";
            let client;

            (async function addUser() {
                try {
                    client = await MongoClient.connect(url);
                    const db = client.db(dbName);
                    const col = db.collection('users');
                    const user = { username, password };
                    const results = await col.insertOne(user);

                    //debug(results);
                    req.login(results.ops[0], () => {
                        debug('login');
                        res.redirect('/auth/profile');
                    });
                } catch (err) {
                    debug(err.track);
                }
            }());


        });

    authRouter.route('/logout')
        .post((req, res) => {
            req.logout();
            res.redirect('/');
        });

    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
            //successRedirect: '/auth/profile',
            successRedirect: '/',
            failureRedirect: '/'
        }));

    authRouter.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            debug('retrieve');
            res.json(req.user);
        });

    return authRouter;
}

module.exports = router;
