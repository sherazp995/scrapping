var express = require('express');
var path = require('path');

const indexRouter = require(path.join(__dirname, 'routes', 'indexRouter'));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.listen(4000, function() {
    console.log("site running on http://localhost:4000")
});