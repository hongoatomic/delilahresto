const UsersController = require('./controller');
const express = require('express')
const mdw = require( '../../middlewares/authentication')

const app = express()

app.get('/', [mdw.verifyToken, mdw.verifyAdmin], UsersController.Fetch)

app.get('/:id', [mdw.verifyToken, mdw.verifyAdmin], UsersController.FetchOne)

app.post('/', UsersController.Create);

app.put('/:id', [mdw.verifyToken, mdw.verifyAdmin], UsersController.Update);

app.delete('/:id', [mdw.verifyToken, mdw.verifyAdmin], UsersController.Delete);

module.exports = app