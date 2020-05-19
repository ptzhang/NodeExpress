const express = require('express');
const bookController = require('../controllers/bookController');


const bookRouter = express.Router();

function router(nav) {

    const { getList, allId, getId, middleware } = bookController(nav);

    bookRouter.use(middleware);

    bookRouter.route('/')
        .get(getList);

    bookRouter.route('/:id')
        .all(allId)
        .get(getId);

    return bookRouter;
}

// module.exports = bookRouter;
module.exports = router;