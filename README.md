# karmabot
bot to add/delete karma 
Bot reads messages from Slack using Slash command, and passes info to the node server
Songs.js parses the request, sanitizes it, and puts it in the database
Mysql.js handles database transactions
karma.js writes to Slack
You need a .env file to read/write to the database
