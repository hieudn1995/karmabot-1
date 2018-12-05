//This is the entry point for the app 
let express     = require('express');
let bodyParser  = require('body-parser');
let request     = require('request');
let shell       = require('shelljs');
let moment      = require('moment');
let query       = require('./mysql')
let app         = express();
let addKarma    = require('./karma');
let mysql       = require('mysql');
let port        = process.env.PORT || 8069;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/karma', function (req, res) {
  //authenticate first 
  if (req.body.token !== process.env.TOKEN){
    return res.status(401).send({ auth: false, message: 'No token or wrong token provided.' });
  } 
  else {
    res.send("_checking_ _karma_..")
    console.log("WRITING KARMA POINTS:")
    let karma     = req.body.text
    let res_url   = req.body.response_url
    let user_name = req.body.user_name
    let name      = /(?:@)[^+-\s]+/gm.exec(karma)|| '@help'
    let posCount  = Math.max( (karma.match(/\+/g) || []).length -1, 0)
    let negCount  = Math.max( (karma.match(/\-/g) || []).length -1, 0)
    let addName   = name[0].replace('@', '')
    let points    = posCount || -1*(negCount)
    console.log("MY POINT IS :"+ points)
    console.log("MY NAME IS :"+ addName)
    let newDate   =  new Date().getTime();
    let date      = moment(newDate).format('dddd, MMMM Do, YYYY h:mm:ss A');
    // Probably good to show the text typed before takign any actions
    // write karma points, and get karma points
    // Write to slack  
    // always returns a karma point
    // If positive count or negative count is null, then query the total karma points
    if (points != 0 && (Math.abs(points) <= 4) {
      //add/delete points
      // Since there are two simultenous DB transactions here,
      // use async
       if (points > 0 && points <= 2) {
           var emoji = ':thumbsup:'
        }
       else if (points > 2){
          var emoji = ':clap:'
        } 
       else {
           var emoji = ':thumbsdown:'
        }

      async function addKarma() {
        const delay     = ms => new Promise(resolve => setTimeout(resolve, ms));
        let result      = await querySongs(addName, points, user_name)
        //let myNewResult = await result
        await delay(200)
        await querySongs(addName,0,user_name, res_url, emoji)
      }
      addKarma();
    }
    else if (req.body.text.indexOf('help') >= 0)  {
      // If help is asked, no need to call any other method, or do a calc
      this.karma('thisKarma','help', 'help', res_url, emoji);
    }
    else if (posCount > 4 || negCount > 4){
      // don't let users abuse this
      this.karma('thisKarma','not_allowed', 'illegal_operation', res_url, emoji);
      console.log("More than 4 points of add or reduce is not allowed!")
    }
    else {
      //If ++ or -- is not mentioned then it is useless to add/delete so simply return the value
      querySongs(addName,0, undefined, res_url, emoji);
    }
  }
}) // close post method

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
