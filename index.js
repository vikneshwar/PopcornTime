var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var router = require('./routes/routes.js');

app.use('/',express.static(__dirname + '/static'));
/*app.set('views', __dirname + '/static/view');
app.engine('html', engines.handlebars);
app.set('view engine', 'html');
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/',router);

/* Define fallback route */
app.use(function(req, res, next) {//jshint ignore:line
    res.status(404).json({
        error: "Route not found"
    });
});

/* Define error handler */
app.use(function (err, req, res, next) {//jshint ignore:line
    // logger.logFullError(err, req.method + " " + req.url);
    res.status(err.httpStatus || 500).send({
		message: err + " Sorry for inconvience, please try again later. Feel free to log the issue."
	});
});
var port = 9000 || process.env.port
app.listen(port ,function() {
    console.log('Express server listening on: '+port);
});