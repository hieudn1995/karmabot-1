//This is the entry point for the app 
const express = require("express");
const  bodyParser = require("body-parser");
const request = require("request");
const shell = require("shelljs");
const  moment = require("moment");
const query = require("./mysql");
const  app = express();
const addKarma = require("./karma");
const  mysql = require("mysql");
const  port = process.env.PORT || 8069;
const  axios = require("axios");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/karma", async function(req, res) {
  if (req.body.token !== process.env.TOKEN) {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
  res.send("_checking_ _karma_..");
  console.log("WRITING KARMA POINTS:");
  console.log(req.body);

  let newdata = axios(process.env.SLACK_USER_INFO_API + req.body.user_id);
  let [name_] = await Promise.all([newdata]);
  let karma = req.body.text.toLowerCase();
  let res_url = req.body.response_url;
  let user_name = name_.data.user.real_name;
  let name = /(?:@)[^+-\s]+/gm.exec(karma) || "@help";
  let posCount = Math.max((karma.match(/\+/g) || []).length - 1, 0);
  let negCount = Math.max((karma.match(/\-/g) || []).length - 1, 0);

  if (name.indexOf("@help") >= 0) {
    console.log(name);
    var addName = "karmabot";
  } else {
    var addName_ = await name[0]
      .replace("@", "")
      .replace(/\|.*/, "")
      .toUpperCase();
    let newdata_ = axios(process.env.SLACK_USER_INFO_API + addName_);
    let [userName] = await Promise.all([newdata_]);
    var addName = userName.data.user.real_name;
  }

  let points = posCount || -1 * negCount;
  console.log("MY POINT IS :" + points);
  console.log("MY NAME IS :" + addName);
  let newDate = new Date().getTime();
  let date = moment(newDate).format("dddd, MMMM Do, YYYY h:mm:ss A");
  // write karma points, and get karma points
  // Write to slack
  // always returns a karma point
  // If positive count or negative count is null, then query the total karma points
  if (points != 0 && (points <= 4 && points >= -4)) {
    //add/delete points
    console.log("my name is", addName);
    console.log("my point is", points);

    if (points > 0 && points <= 2) {
      var emoji = ":thumbsup:";
    } else if (points > 2) {
      var emoji = ":clap:";
    } else {
      var emoji = ":thumbsdown:";
    }
    // Since there are two simultenous DB transactions here,
    // use async
    async function addKarma() {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      let result = await querySongs(addName, points, user_name);
      //let myNewResult = await result
      await delay(200);
      await querySongs(addName, 0, user_name, res_url, emoji);
    }

    addKarma();
  } else if (name.indexOf("@help") >= 0) {
    // If help is asked, no need to call any other method, or do a calc
    this.karma("thisKarma", "help", "help", res_url, emoji);
  } else if (posCount > 4 || negCount > 4) {
    // don't let users abuse thi
    this.karma("thisKarma", "not_allowed", "illegal_operation", res_url, emoji);
    console.log("More than 4 points of add or reduce is not allowed!");
  } else {
    //If ++ or -- is not mentioned then it is useless to add/delete so simply return the value
    querySongs(addName, 0, undefined, res_url, emoji);
    console.log("I SHOULDNT BE HERE");
  }
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
