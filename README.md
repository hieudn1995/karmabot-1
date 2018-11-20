# karmabot
1. bot to add/delete karma 
2. Bot reads messages from Slack using Slash command, and passes info to the node server
3. Songs.js parses the request, sanitizes it, and puts it in the database
4. Mysql.js handles database transactions
5. karma.js writes to Slack
6. You need a .env file to read/write to the database
