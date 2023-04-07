const express = require("express")
const app = express()
const mysql = require("mysql")

var db = mysql.createConnection({
  host: "34.66.235.118",
  user: "root",
  password: "test1234",
  database: "Game_Data",
})

db.connect(function(err) {
    if (err) throw err;
    // var sql = "INSERT INTO `LoginUser` (`UserId`,`FirstName`, `LastName`) VALUES (20, 'Zack', 'M');";
    // var sql = "INSERT INTO `BannedGameTitle` (`UserId`, `GameId`) VALUES (10, 20);";
    // var sql = "DELETE FROM BannedGameTitle WHERE UserId = 10";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  });

// app.get('/', (require, response) => {
//   const sqlInsert = "INSERT INTO `BannedGameTitle` (`UserId`, `GameId`) VALUES (10, 20);";
//   db.query(sqlInsert, (err, result) => {
//     response.send("Hello, Word!!!!");
//   })
// })

app.listen(3002, () => {
  console.log("running on port 3002")
})