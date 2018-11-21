# karmabot
1. Bot to add/delete karma 
2. Bot reads messages from Slack using Slash command, and passes info to the node server
3. app.js parses the request, sanitizes it, and puts it in the database. It is the entry point for the app
4. Mysql.js handles database transactions
5. karma.js writes to Slack
6. You need a .env file to read/write to the database
7. To run: npm install, node app.js
8. To run it locally, you need to edit app.js, and add your text that would normally come from slack in the karma variable, start the server, and use HTTP POST to the localhost:3306/karma 
