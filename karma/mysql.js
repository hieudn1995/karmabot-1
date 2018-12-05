require('dotenv').config({path: `${__dirname}/.env`});
const mysql = require('mysql');
// Const system = require('system');
const newKarma = require('./karma');

const querySongs = (userId, points, user_name, res_url, emoji) => {
	const Initialized = false;
	const con = mysql.createConnection({
		multipleStatements: true,
		host: process.env.HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		port: 3306,
		database: process.env.DATABASE
	});

	con.connect(err => {
		console.log('Connected!');
		console.log('my userID is', userId);
		console.log('my DBpoint is', points);
		console.log('my host is', process.env.HOST);
		if (points !== 0 || points !== '0') {
			const post = {name: userId, points};
			con.query('INSERT INTO karma SET ?', post, (err, result) => {
				if (err) {
					throw err;
				}
				con.end();
			});
		} else {
			con.query('select SUM(points) as total from karma where name= ?', [userId], (err, result) => {
				if (err) {
					throw err;
				}
				const queryResult = result[0];
				console.log(queryResult.total);

				// CALL SLACK FROM HERE -->
				newKarma(queryResult.total, userId, user_name, res_url, emoji);
				con.end();
			});
		}
	});
};

module.exports = querySongs();
