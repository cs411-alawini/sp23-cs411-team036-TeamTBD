const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

var db = mysql.createConnection({
  host: "34.66.235.118",
  user: "root",
  password: "test1234",
  database: "Game_Data",
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/get1", (require, response) => {
    const sqlAdv1= "SELECT COUNT(GameId) AS gameCount, requiredAge FROM (SELECT * FROM GamePurchasing WHERE isFree = 'false') nonFree NATURAL JOIN Genres NATURAL JOIN GeneralGameDescrip WHERE GenreIsAction = 'true' AND PriceFinal > 0 GROUP BY requiredAge ORDER BY requiredAge"
    db.query(sqlAdv1, (err, result) => { 
        response.send(result);
    });
    
});
app.get("/api/get2", (require, response) => {
    const sqlAdv2= "SELECT GameName FROM GeneralGameDescrip NATURAL JOIN Categories NATURAL JOIN GamePurchasing WHERE CategorySinglePlayer='false' AND PriceFinal>0 AND PriceFinal<=(SELECT AVG(gp.PriceFinal) FROM GamePurchasing gp join Categories ct WHERE PriceFinal>0 AND ct.CategorySinglePlayer='false')"
    db.query(sqlAdv2, (err, result) => { 
        response.send(result);
    });
});
    
app.get("/api/get", (req, res) => {
    const userId = req.query.userId
    const sqlSelect = "SELECT * FROM BannedGameTitle WHERE UserId = ?";
    db.query(sqlSelect, [userId], (err, result) => {
        res.send(result);
        console.log(result);
    });
});

app.post("/api/insert", (req, res) => {
    const userId = req.body.userId;
    const gameId = req.body.gameId;
    const sqlInsert = "INSERT INTO `BannedGameTitle` (`UserId`, `GameId`) VALUES (?,?)";
    db.query(sqlInsert, [userId, gameId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("1 record inserted");
        }
    })
});

app.delete("/api/delete/:gameId/:userId", (req, res) => {
    const gameId = req.params.gameId
    const userId = req.params.userId
    const sqlDelete = "DELETE FROM `BannedGameTitle` WHERE `GameId`= ? AND `UserId` = ?";
    db.query(sqlDelete, [gameId, userId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("1 record deleted");
        }
    })
});

app.put("/api/update/:gameId/:newGameId/:userId", (req, res) => {
    const gameId = req.params.gameId
    const newGameId = req.params.newGameId
    const userId = req.params.userId
    const sqlUpdate = "UPDATE `BannedGameTitle` SET `GameId` = ? WHERE `GameId`= ? AND `UserId` = ?";
    db.query(sqlUpdate, [newGameId, gameId, userId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log("1 record updated");
        }
    })
});

app.listen(3002, () => {
    console.log("running on port 3002");
})
