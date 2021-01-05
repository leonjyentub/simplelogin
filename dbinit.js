var db = require('./db');

const bcrypt = require('bcrypt');
//加鹽可以增加密碼被破解的難度
const saltRounds = 10;

console.log('database initialize..');
db.serialize(function () {
	db.run(`CREATE TABLE if not exists "messages" (
		"id"	INTEGER NOT NULL,
		"title"	TEXT NOT NULL,
		"content"	TEXT,
		"author" INTEGER NOT NULL,
		"lastupdatedtime"	datetime NOT NULL,
		PRIMARY KEY("id" AUTOINCREMENT));`);
	db.run(`CREATE TABLE IF NOT EXISTS users(
		id INTEGER NOT NULL,
		email TEXT NOT NULL,
		password TEXT NOT NULL,
		createdtime datetime NOT NULL,
		PRIMARY KEY("id" AUTOINCREMENT)	
	);`);
});

bcrypt.hash('test123', saltRounds, function (err, hashpwd) {
	db.run('INSERT INTO USERS (EMAIL, PASSWORD, CREATEDTIME) values(?,?, ?);',
		['leonjye@ntub.edu.tw', hashpwd, new Date().toLocaleString()],
		function (err) {
			if (err) console.log('新增帳號失敗！' + err.message);
			console.log("新增帳號ok-1")
		});
});

bcrypt.hash('test123', saltRounds, function (err, hashpwd) {
	db.run('INSERT INTO USERS (EMAIL, PASSWORD, CREATEDTIME) values(?,?, ?);',
		['leonjye@gmail.com', hashpwd, new Date().toLocaleString()],
		function (err) {
			if (err) console.log('新增帳號失敗！' + err.message);
			console.log("新增帳號ok-2")
		});
});
bcrypt.hash('test123', saltRounds, function (err, hashpwd) {
	db.run('INSERT INTO USERS (EMAIL, PASSWORD, CREATEDTIME) values(?,?, ?);',
		['test@mymail.com', hashpwd, new Date().toLocaleString()],
		function (err) {
			if (err) console.log('新增帳號失敗！' + err.message);
			console.log("新增帳號ok-3")
		});
});