const request = require('request');
// This mehtod is responsible for reading and writing from Slack

const karma = async function(value, text, user_name, res_url, emoji) {
    let sendText;
    if ((await text.indexOf('help')) >= 0) {
        sendText =
            '```--- HELP TOPICS --- \n' +
            'To add or deduct karma, simply type /karma @user ++ (or --) where @user is the slack username.\n' +
            'To see karma points, simply type /karma @user.\n' +
            'To ask for help, just type /karma help```';
    } else if ((await text.indexOf('not_allowed')) >= 0) {
        sendText =
            '```--- NOT ALLOWED TO ADD/ DELETE MORE THAN 4 POINTS ---```';
    } else if (typeof user_name === 'undefined') {
        sendText = text + "'s _total_ _karma_ _points_ _is_ *" + value + '*';
    } else if (value == 'null') {
        sendText = text + " doesn't have any Karma points :sob:";
    } else if (text == '') {
        sendText =
            "_To_ _check/add/delete_ karma _points_, _you_ _must_ _use_ '@' _before_ _a_ _user's_ _name_\n" +
            'Check the help section by typing */karma help*';
    } else {
        sendText =
            text +
            "'s _karma_ has been updated to *" +
            value +
            '* by ' +
            user_name +
            ' ' +
            emoji;
    }

    const options = {
        method: 'post',
        body: {
            response_type: 'in_channel',
            text: sendText,
        },
        json: true, // Use,If you are sending JSON data
        url: res_url,
        headers: {
            'Content-type': 'application/json',
        },
    };
    request(options, (err, res, body) => {
        if (err) {
            console.log('Error :', err);
        }
        console.log(' Body :', body);
    });
};
module.exports = karma();
