require('dotenv').config({path:`${__dirname}/.env`});
let mysql     = require('mysql');
let system    = require('system');
let newKarma  = require('./karma')


querySongs = function(userId, points, user_name, res_url) {
  let Initialized = false;
  let con         = mysql.createConnection({
    multipleStatements: true,
    host:      process.env.HOST,
    user:      process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    port: 3306,
    database:  process.env.DATABASE
  });

  con.connect(function(err) {
    console.log("Connected!");
    console.log("my userID is", userId)
    console.log("my DBpoint is", points)
    console.log("my host is", process.env.HOST)
    if (points != 0 || points != '0') {
      let post  = {name: userId, points: points};
      con.query('INSERT INTO karma SET ?', post, function (err, result) {
        if (err) throw err;
        con.end();
      });
    }
    else {
      con.query("select SUM(points) as total from karma where name= ?",[userId], function (err, result) {
        if (err) throw err;
        let queryResult = result[0]
        console.log(queryResult.total)

        //CALL SLACK FROM HERE -->
        karma(queryResult.total, userId, user_name, res_url)
        con.end();
      });
    }

  });

}


module.exports = querySongs();
