var express = require('express');
var router = express.Router();

//var file = "msgboard.db";
//var sqlite3 = require("sqlite3").verbose();
//var db = new sqlite3.Database(file);
var db = require('../db');
//加密套件
const bcrypt = require('bcrypt');
//加鹽可以增加密碼被破解的難度
const saltRounds = 10;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/register')
  .get((req, res, next) => {
    res.render('register');
  })
  .post((req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    var confirmed = req.body.confirmedpassword;
    if (password == confirmed) {
      //在這邊將密碼進行加密後，存到資料庫中
      bcrypt.hash(password, saltRounds, function (err, hashpwd) {
        db.run('INSERT INTO USERS (EMAIL, PASSWORD, CREATEDTIME) values(?,?, ?);',
          [email, hashpwd, new Date().toLocaleTimeString()],
          function (err) {
            if (err) res.send('新增帳號失敗！' + err.message);
            res.redirect('login');
          });
      });
    } else {
      res.send('兩次密碼不一樣！');
    }
  });

router.route('/login')
  .get((req, res, next) => {
    req.session.test = "hello ntub";
    res.render('login');
  })
  .post((req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    db.get('select id, email, password from users where email=?', email, (err, user) => {
      if (err) res.send('取得帳號資訊錯誤！' + err.message);
      if (user) { //的確有這個使用者的時候
        var hashpwd = user.password;
        //注意，因為密碼已經被加密，而且無法還原，所以只能取出後再做比較
        bcrypt.compare(password, hashpwd, function (err, result) {
          if (result) {
            //res.send('登入成功，你好。' + user.email);
            req.session.loggedin = true;
            req.session.user = user;
            console.log('將user存放到session中');
            res.redirect('/msglist');
          } else {
            res.status(401);
            res.send('密碼錯誤！');
          }
        });
      } else {
        res.status(401);
        res.send('找不到使用者！');
      }
    });
  });

router.route('/msglist').get((req, res, next)=>{
  var user = req.session.user;
  if(user){
    db.all(`
      select m.id, m.title, m.content, m.author, u.email, m.lastupdatedtime
      from messages m, users u 
      where m.author = u.id` 
      ,(err, rows)=> { res.render('msglist', {rows: rows, author: user.id});}
    );
  }else{
    console.log('未登入！');
    res.redirect('/login');
  }
});

router.get('/initdb', (req, res)=>{
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
  res.send('done');
});
module.exports = router;
