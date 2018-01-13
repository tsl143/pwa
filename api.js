const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }));
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));


app.post('/data/signin', (req, res) => {
    fs.readFile(path.join(__dirname, '../example/public/data/signin.json'), 'utf8', function(error, content) {
        var json = JSON.parse(content);
        res.end(JSON.stringify(json));
    });
});


app.get('/getFriends', (req, res) => {
    let json;
    if(req.query.id == 1) {
        json = {
            "friends": [
                {
                    "name": "Rohit",
                    "channelId": "1497165653730393",
                    "imageUrl": "1497165653730393",
                    "meetingId": "39917041"
                },
                {
                    "name": "Dev",
                    "channelId": "app123464761549791",
                    "imageUrl": "app123464761549791",
                    "meetingId": "39917040"
                }
            ],
            "me": {
                "name": "Manas",
                "channelId": "1633552226682996",
                "imageUrl": "1633552226682996"
            }
        }
    } else if(req.query.id == 2) {
        json = {
            "friends": [
                {
                    "name": "Dev",
                    "channelId": "app123464761549791",
                    "imageUrl": "app123464761549791",
                    "meetingId": "39917045"
                },
                {
                    "name": "Manas",
                    "channelId": "1633552226682996",
                    "imageUrl": "1633552226682996",
                    "meetingId": "39917041"
                }
            ],
            "me": {
                "name": "Rohit",
                "channelId": "1497165653730393",
                "imageUrl": "1497165653730393"
            }
        }
    } else if(req.query.id == 3) {
        json = {
            "friends": [
                {
                    "name": "Rohit",
                    "channelId": "1497165653730393",
                    "imageUrl": "1497165653730393",
                    "meetingId": "39917045"
                },
                {
                    "name": "Manas",
                    "channelId": "1633552226682996",
                    "imageUrl": "1633552226682996",
                    "meetingId": "39917040"
                }
            ],
            "me": {
                "name": "Dev",
                "channelId": "app123464761549791",
                "imageUrl": "app123464761549791"
            }
        }
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end(JSON.stringify(json));
});



app.use(express.static(path.join(__dirname, '../example/public')));
app.use(express.static(path.join(__dirname, '../dist')));


app.listen(8081, '0.0.0.0', err => {
    if (err) {
        console.warn(err);
        return;
    }
    console.info('http://localhost:8081');
});