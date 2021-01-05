var file = "msgboard.db";

//載入 sqlite3
var sqlite3 = require("sqlite3").verbose();
//var sqlite3 = require(":memory:").verbose();
var db = new sqlite3.Database(file);

module.exports = db;