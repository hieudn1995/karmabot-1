var request    = require('request');
//This mehtod is responsible for reading and writing from Slack

  karma = async function(value, text, user_name, res_url){

  if (await text.indexOf('help') >= 0){
    var sendText = "```--- HELP TOPICS --- \n" +
    "To add or deduct karma, simply type /karma @user ++ (or --) where @user is the slack username.\n" +
    "To see karma points, simply type /karma @user.\n" +
    "To ask for help, just type /karma help```"
  }
  else if (typeof user_name === 'undefined'){
    var  sendText = text + "'s _total_ _karma_ _points_ _is_ *"+ value + "*"
  } else {
    var sendText = text + "'s _karma_ has been updated to *"+ value + "* by " + user_name
  }  


    method: 'post',
    body: {
      response_type: "in_channel",
      text: sendText
    },
    json: true, // Use,If you are sending JSON data
    url: res_url,
    headers: {
      'Content-type': 'application/json'
    }
  }
  request(options, function (err, res, body) {
    if (err) {
      console.log('Error :', err)
    }
    console.log(' Body :', body)
  });

}// if else ends
module.exports = karma();
