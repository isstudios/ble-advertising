
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var path = require('path');
var chalk = require('chalk');
var express = require('express');
var stormpath = require('express-stormpath');
var https = require('https');
var http = require('http');
var app = express();
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;
var url = 'mongodb://db.savrides.com:27017/adverts'
var helmet = require('helmet');
app.use(helmet());
var ninetyDaysInMilliseconds = 10886400000;
msgA = ''
msgB = ''

app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds,     // Must be at least 18 weeks to be approved by Google 
  includeSubdomains: true, // Must be enabled to be approved by Google 
  preload: true }))

var enforce = require('express-sslify');

var Bot = require('slackbots');
app.use(enforce.HTTPS());
// create a bot
var settings = {
    token: 'xoxb-45586538402-8gL9e1USpCA9nsJDM3Y5VqPd',
    name: 'adverts'
};
var bot = new Bot(settings);

bot.on('start', function() {
    console.log('bot start')
        bot.postMessageToChannel('advertbot', 'Advert Sir Bottington in the house BITCHES');
});

var options = {
 ca: fs.readFileSync("cert/chain.pem"),
 key: fs.readFileSync("cert/privkey.pem"),
 cert: fs.readFileSync("cert/fullchain.pem")
};

//http.createServer(app).listen(3001);
//https.createServer(options, app).listen(3002);

// Globals
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

app.use(stormpath.init(app, {
    web: {
        login: {
            enabled: true,
        },
        logout: {
            enabled: true
        },
	register:{  
	   enabled:false
	},
        me: {
            enabled: false
        }
    }
}));

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


app.use(logger('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


        http.createServer(app).listen(3001);
        https.createServer(options, app).listen(8443);
app.on('stormpath.ready', function() {
//	http.createServer(app).listen(3001);
//	https.createServer(options, app).listen(3002);
        console.log("server listening on 3000");
});


//app.get('/', function(req, res) {
//  res.render('home', {
//    title: 'Welcome'
//  });
//});

var getHrDiffTime = function(time) {
    var ts = process.hrtime(time);
    return (ts[0] * 1000) + (ts[1] / 1000000);
};

var outputDelay = function(interval, maxDelay) {
    maxDelay = maxDelay || 100;

    var before = process.hrtime();

    setTimeout(function() {
        var delay = getHrDiffTime(before) - interval;

        if (delay < maxDelay) {} else {
            console.log('delay is %s', chalk.red(delay));
        }

        outputDelay(interval, maxDelay);
    }, interval);
};

outputDelay(300);