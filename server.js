// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// enable moment library
var moment = require('moment');

const validDateFormats = ["MM-DD-YYYY", "YYYY-MM-DD"];

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Handle requests to the API
app.get('/api/timestamp/:date_string?', (req, res) => {
    var dateFormatObject;

    if (req.params.date_string === undefined){
        let dateValue = new Date();
        dateFormatObject = {"unix": dateValue.getTime(), "utc": dateValue.toUTCString()};
    }
    else if (moment(req.params.date_string, validDateFormats).isValid()) {
        let dateValue       = moment(req.params.date_string).format("ddd, D MMM YYYY HH:mm:ss [GMT]");
        let dateValueUnix   = parseInt(moment(req.params.date_string).format("x"), 10);
        
        dateFormatObject    = {"unix": dateValueUnix,  "utc": dateValue};
    }
    else if(req.params.date_string.match(/\D/) === null) {
        let dateValue       = new Date(parseInt(req.params.date_string, 10));
        dateFormatObject    = {"unix": dateValue.getTime(), "utc": dateValue.toUTCString()};
    }
    else {
        dateFormatObject = {"unix": null, "utc": "Invalid Date" };
    }
    
    res.json(dateFormatObject);
});

// Handle requests to a resource that doesn't exist (is not implemented)
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
  });

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});