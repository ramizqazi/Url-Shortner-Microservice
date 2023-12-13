require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const urlparser = require('url');
const cors = require('cors');
const app = express();

// http://expressjs.com/en/starter/static-files.html

// Basic Configuration
const port = 3000;
mongoose.connect("mongodb+srv://ramiz:takkansix123@panaverse-backend-by-ra.sjl8l5i.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
//console.log(mongoose.connection.readyState);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.static('public'));

const Schema = mongoose.Schema;
let UrlSchema = new Schema({ url: String, shorturl: Number });

let Url = mongoose.model("Url", UrlSchema);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  console.log(req.body);
  const bodyurl = req.body.url;
  const checkaddress = dns.lookup(urlparser.parse(bodyurl).hostname, (err, address) => {
    if (!address) {
      res.json({ error: 'invalid url' })
    } else {
      let shortUrl = Math.floor(Math.random() * 100000);
      console.log(shortUrl);
      const url = new Url({ url: bodyurl, shorturl: shortUrl });
      console.log('hello');
      url.save().then((data) => {
        res.json({ original_url: data.url, short_url: data.shorturl })
      }).catch(err => {
        console.log(err);
      })
    }
  })

});

app.get('/api/shorturl/:shortUrl', function (req, res) {
  let shortURL = req.params.shortUrl;
  Url.findOne({ shorturl: Number(shortURL) }).then((data) => {
    res.redirect(data.url);
  }).catch(e => {
    console.log(e)
  });
})

// listen for requests :)
var listener = app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});