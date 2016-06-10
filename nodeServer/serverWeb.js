// Required for Express Server / Routers

var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var path = require('path');
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

// Required for TLS authentication
// https://letsencrypt.org/ Let’s Encrypt is a new Certificate Authority: It’s free, automated, and open. 

var options = {
 ca: fs.readFileSync("cert/chain.pem"),
 key: fs.readFileSync("cert/privkey.pem"),
 cert: fs.readFileSync("cert/fullchain.pem")
};
var helmet = require('helmet');
var ninetyDaysInMilliseconds = 10886400000;
var enforce = require('express-sslify');

// Required for real-time reporting to slack

var Bot = require('slackbots');
var settings = {
    token: 'GET YOUR TOKEN', // Learn more Here https://api.slack.com/bot-users
    name: 'adverts' // Name of Bot
};
var bot = new Bot(settings);

// Connect to DB for tracking interaction

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;
var url = 'mongodb://[INSERT SERVER ADDRESS]:27017/adverts'

// Custom served Messages (if you want)
msgA = ''
msgB = ''

// Start Express Middlewares

app.use(helmet());
app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds,     // Must be at least 18 weeks to be approved by Google 
  includeSubdomains: true, // Must be enabled to be approved by Google 
  preload: true })) // More google related stuff
app.use(enforce.HTTPS());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(3001);
https.createServer(options, app).listen(8443);

//Start the reporting bot
bot.on('start', function() {
    console.log('bot start')
        bot.postMessageToChannel('advertbot', 'Advert Sir Bottington in the house');
});

function DbConnect() {
    MongoClient.connect(url, function(err, database) {
        if (err) throw err;

        db = database;
        // Start the application after the database connection is ready
    });
    setTimeout(function() {
        console.log('DB Connected');
    }, 1000);
}

DbConnect();

app.route('/A')
   .get( function(req, res) {
        bot.postMessageToChannel('advertbot', 'Beacon Loaded Page A')
        db.collection('pages').update({
                "pageID": 'A'
            }, {
                $push: {
                    beacon: {
                        "timestamp": new Date().getTime()
                    }
                }
            }, {
                upsert: true
            },
            function(err, inserted) {
                console.log('Page A Beaconed')
            });
        res.render('A', {
            msg: msgA
        });
    })
   .post(function(req, res) {
        bot.postMessageToChannel('advertbot', 'User Interacted with Page A')
        db.collection('pages').update({
                "pageID": 'A'
            }, {
                $push: {
                    beacon: {
                        "interaction": new Date().getTime()
                    }
                }
            }, {
                upsert: true
            },
            function(err, inserted) {
                console.log('Page A Visited')
            });
   });

app.route('/B')
   .get( function(req, res) {
        bot.postMessageToChannel('advertbot', 'Beacon Loaded Page B')
        db.collection('pages').update({
                "pageID": 'B'
            }, {
                $push: {
                    beacon: {
                        "timestamp": new Date().getTime()
                    }
                }
            }, {
                upsert: true
            },
            function(err, inserted) {
                console.log('Page B Beaconed')
            });
        res.render('B', {
            msg: msgA
        });
    })
   .post(function(req, res) {
        bot.postMessageToChannel('advertbot', 'User Interacted with Page B')
        db.collection('pages').update({
                "pageID": 'B'
            }, {
                $push: {
                    beacon: {
                        "interaction": new Date().getTime()
                    }
                }
            }, {
                upsert: true
            },
            function(err, inserted) {
                console.log('Page B Visited')
            });
   });