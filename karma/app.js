// This is the entry point for the app
const express = require('express');
const bodyParser = require('body-parser');
// Const shell = require('shelljs');
const moment = require('moment');
const querySongs = require('./mysql');

const app = express();
// Const addKarma = require('./karma');

const port = process.env.PORT || 8069;

app.use(bodyParser.urlencoded({extended: true}));

app.post('/karma', function (req, res) {
  // Authenticate first
  if (req.body.token !== process.env.TOKEN) {
    return res.status(401).send({auth: false, message: 'No token or wrong token provided.'});
  }

  res.send('_checking_ _karma_..');
  console.log('WRITING KARMA POINTS:');
  const karma = req.body.text;
  const {res_url, user_name} = req.body;
  const name = /(?:@)[^+-\s]+/gm.exec(karma) || '@help';
  const posCount = Math.max((karma.match(/\+/g) || []).length - 1, 0);
  const negCount = Math.max((karma.match(/-/g) || []).length - 1, 0);
  const addName = name[0].replace('@', '');
  const points = posCount || -1 * (negCount);
  console.log('MY POINT IS :' + points);
  console.log('MY NAME IS :' + addName);
  const newDate = new Date().getTime();
  // Const date = moment(newDate).format('dddd, MMMM Do, YYYY h:mm:ss A');
  // Probably good to show the text typed before takign any actions
  // write karma points, and get karma points
  // Write to slack
  // always returns a karma point
  // If positive count or negative count is null, then query the total karma points
  let emoji;
  if (points != 0 && (Math.abs(points) <= 4)) {
    // Add/delete points
    // Since there are two simultenous DB transactions here,
    // use async
    if (points > 0 && points <= 2) {
      emoji = ':thumbsup:';
    } else if (points > 2) {
      emoji = ':clap:';
    } else {
      emoji = ':thumbsdown:';
    }

    const addKarma = async () => {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      const result = await querySongs(addName, points, user_name);
      // Let myNewResult = await result
      await delay(200);
      await querySongs(addName, 0, user_name, res_url, emoji);
    };
    addKarma();
  } else if (req.body.text.indexOf('help') >= 0) {
    // If help is asked, no need to call any other method, or do a calc
    this.karma('thisKarma', 'help', 'help', res_url, emoji);
  } else if (posCount > 4 || negCount > 4) {
    // Don't let users abuse this
    this.karma('thisKarma', 'not_allowed', 'illegal_operation', res_url, emoji);
    console.log('More than 4 points of add or reduce is not allowed!');
  } else {
    // If ++ or -- is not mentioned then it is useless to add/delete so simply return the value
    querySongs(addName, 0, undefined, res_url, emoji);
  }
}); // Close post method

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
