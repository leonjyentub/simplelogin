var express = require('express');
var router = express.Router();

// var file = "msgboard.db";
// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database(file);

var db = require('../db');

router.route('/new')
    .get((req, res, next) => {
        if (req.session.user) {
            var user = req.session.user;
            res.render('create', { user: user });
        } else {
            res.redirect('/login');
        }
    })
    .post((req, res, next) => {
        if (req.session.user) {
            var title = req.body.title;
            var content = req.body.content;
            var myuserid = req.session.user.id;
            console.log("post by myuserid: " + myuserid);
            db.run(`insert into messages(title, content, author, lastupdatedtime) values (?,?,?,?)`,
                [title, content, myuserid, new Date().toLocaleString()],
                (err) => {
                    if (err) {
                        res.render('新增訊息發生錯誤' + err.message);
                    } else {
                        res.send('發文成功！');
                    }
                });
        } else {
            console.log('post->/new: 未登入');
            res.redirect('/login');
        }
    });

var permissionCheck = (req, res, next) => {
    if (req.session.user) {
        var user = req.session.user;
        var msgID = req.params.id;
        db.get('select id from messages where id = ? and author = ?',
            [msgID, user.id],
            (err, row) => {
                if (err) res.send('取得檢查資料錯誤！' + err.message);
                else if (row)
                    next();
                else
                    res.send(`目前帳號: ${user.email} 無權限取存`);
            });
    } else {
        res.redirect('/login');
    }
}

router.get('/edit/:id', permissionCheck, (req, res) => {
    var msgID = req.params.id;
    var user = req.session.user;
    if (user) {
        db.get('select id, title, content from messages where id = ?', msgID, (err, row) => {
                if (err) res.send('編輯取得文章內容錯誤！' + err.message);
                if (row) {
                    res.render('edit', { row: row, user: user });
                } else {
                    res.send(`沒有找到ID=${msgID}的文章！`);
                }
            });
    } else {
        res.redirect('/login');
    }

});
router.post('/edit/:id', permissionCheck, (req, res, next) => {
    
});
module.exports = router;