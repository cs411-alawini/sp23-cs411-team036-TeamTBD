const express = require("express");
const app = express();
const mysql = require("mysql");
var db = mysql.createConnection({
    host:'localhost', //could be ip address of sql data - change if database does not change
    user: 'root',
    password:'test1234',
    database:'Game_Data',
})

app.get('/', (require, response) => {
    // const sqlInsert = "INSERT INTO `movie_reviews` (`movieName`,`movieReview`) VALUES ('Spider2', 'good movie');";
    const sqlInsert = "INSERT INTO `BannedGameTitle` (`UserId`, `GameId`) VALUES (01,20);";
    db.query(sqlInsert, (err, result) => {
        response.send("Hello world!!!!!!!!!!");
    }) })


app.listen(3002, () => {
    console.log("running on port 3002");
})