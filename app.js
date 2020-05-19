var express = require("express");
var chalk = require("chalk");
var debug = require("debug")("app");
var morgan = require("morgan");
var path = require("path");
//const sql = require('mssql');
const bodyParser = require('body-parser');

const session = require('express-session');
const cookieParser = require('cookie-parser');


var app = express();
const port = process.env.PORT || 3000;

// const config = {
//     user: 'library',
//     password: 'Password#',
//     server: 'pslibrary1234.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
//     database: 'library',
// };

// sql.connect(config).catch(err => debug(err));

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "Library" }));
require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use("/js", express.static(path.join(__dirname, "node_modules/popper.js/dist")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

// app.use((req, res, next) => {
//     debug('my middleware!');
//     next();
// });

app.set("views", "./src/views");
app.set("view engine", "ejs");

const nav = [
    { link: '/books', title: 'Books' },
    { link: '/authors', title: 'Authors' }
];


const bookRouter = require('./src/routes/bookRoutes')(nav);
app.use('/books', bookRouter);
const adminRouter = require('./src/routes/adminRoutes')(nav);
app.use('/admin', adminRouter);
const authRouter = require('./src/routes/authRoutes')(nav);
app.use('/auth', authRouter);

app.get("/", (req, res) => {
    //res.send("hello from my library app");
    //res.sendFile(path.join(__dirname, "views", "index.html"));
    //res.render("index", { list: ["a", "b"], title: "My Library" });
    res.render(
        'index',
        {
            nav: [{ link: '/books', title: 'Books' },
            { link: '/authors', title: 'Authors' }],
            title: 'Library',
            user:req.user
        }
    )
});

app.listen(port, function () {
    //console.log(`listening on port ${chalk.green("3000")}`);
    debug(`listening on port ${chalk.green(port)}`);
});



