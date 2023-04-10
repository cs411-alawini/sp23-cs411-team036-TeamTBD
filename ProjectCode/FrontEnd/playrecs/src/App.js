import './App.css';
import React, {useState, useEffect} from "react";
import Axios from 'axios';

function App() {

//useState() used to display banned game titles
const [UserId, setUserId] = useState();                             //stores current UserId
const [gameReviewList, setGameIdList] = useState([]);               //stores the data returned from the query in .get() function

//useState() used to INSERT game to BannedGameTitle Table
const [addedGameTitle, setAddedGameTitle] = useState();

//useState() used to DELETE game from BannedGameTitle Table
const [deletedGameTitle, setDeletedGameTitle] = useState();

//useState() used to UPDATE game from BannedGameTitle Table
const [updatedGameTitle, setUpdatedGameTitle] = useState();
const [updatedToGameTitle, setUpdatedToGameTitle] = useState();


const DisplayTitles = () => {
  Axios.get('http://localhost:3002/api/get/', {params: {userId: UserId}}).then((response) => {
    setGameIdList(response.data)
  });
}

const InsertTitles = () => {
  Axios.post('http://localhost:3002/api/insert', {
  userId: UserId,
  gameId: addedGameTitle
  }); 
  DisplayTitles();
}

const deleteGameId = (gameId, userId) => {
  Axios.delete(`http://localhost:3002/api/delete/${gameId}/${userId}`);
  DisplayTitles();
};

const updateGameId = (gameId, newGameId, userId) => {
  Axios.put(`http://localhost:3002/api/update/${gameId}/${newGameId}/${userId}`);
  DisplayTitles();
};



return (
<div className="App">
  <h1>WELCOME TO PLAYRECS</h1>
  <label>Type your UserId to display User Data</label>
  <div className="form">
    <label> User Id:</label>
    <input type="text" name="UserId" onChange={(e) => {
      setUserId(e.target.value)
    }}/>
    <button onClick={DisplayTitles}> Submit </button>

      {/* the view for displaying the "banned games" for typed user */}
      <div>
        <h1>Banned Games Titles </h1>
        {gameReviewList.map((val) => {
          return (
            <div className = "card">
              <p>Game Id:{val.GameId}</p>
            </div>
          );          
        })}
      </div>

      {/* the view to INSERT  */}
      <input type="text" name="addedGameTitle" onChange={(e) => {
      setAddedGameTitle(e.target.value)
      }}/>
      <button onClick={() => {InsertTitles()}}> Add Game </button>

      {/* the view to DELETE  */}
      <input type="text" name="deletedGameTitle" onChange={(e) => {
      setDeletedGameTitle(e.target.value)
      }}/>
      <button onClick={() => {deleteGameId(deletedGameTitle, UserId)}}> Delete Game </button>

      {/* the view to UPDATE  */}
      <label for="input1">GameId to update:</label>
      <input type="text" name="updatedGameTitle" onChange={(e) => {
      setUpdatedGameTitle(e.target.value)
      }}/>
      <label for="input2">New GameId:</label>
      <input type="text" name="updatedtoGameTitle" onChange={(e) => {
      setUpdatedToGameTitle(e.target.value)
      }}/>
      <button onClick={() => {updateGameId(updatedGameTitle, updatedToGameTitle, UserId)}}> Update Game </button>
  </div> 
</div>
  );
}

export default App;