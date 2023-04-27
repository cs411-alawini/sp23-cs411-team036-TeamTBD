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

//advQuery 1 and 2
const [advQueryList1, setAdvQueryList1] =useState([]);
const [advQueryList2, setAdvQueryList2] =useState([]);

const[showAdvQuery1, setShowAdvQuery1] = useState(false);
const[showAdvQuery2, setShowAdvQuery2] = useState(false);


//const numGenreCollections = 18;
const GenreCategories = ["GenreIsIndie","GenreIsAction","GenreIsAdventure","GenreIsCasual",
"GenreIsStrategy","GenreIsRPG","GenreIsSimulation","GenreIsEarlyAccess","GenreIsFreeToPlay",
"GenreIsSports","GenreIsRacing","GenreIsMassivelyMultiplayer","CategorySinglePlayer","CategoryMultiplayer",
"CategoryCoop","CategoryMMO","CategoryInAppPurchase","CategoryIsNonGame"];
const[checked, setChecked]=useState(new Array(GenreCategories.length+2).fill(false));
const[sqlToInsert, setSqlToInsert] = useState('');
const[filteredGameList, setFilteredGameList] = useState([]);
const[searchText, setSearchText]=useState('');
const SearchFilter = () => {
  Axios.get('http://localhost:3002/api/getFilter/', {params: {sqlToInsert: sqlToInsert}}).then((response) => {
    setFilteredGameList(response.data)
  });
}
//When search button clicked, create SQL string and call SearchFilter
const Search = () => {
  var sqlLine = "";
  for(var i = 0; i < GenreCategories.length; i++) {
    if(checked[i]===true) {
      if(sqlLine.length === 0) {
        sqlLine+=GenreCategories[i]+"='true'";
      } else {
        sqlLine+=" AND "+GenreCategories[i]+"='true'";
      }
    }
  }
  //user text includes text = "" for empty so can keep WHERE in sqlFinal
  if(sqlLine.length === 0) {
    sqlLine+="GameName LIKE %"+searchText+"%";
  } else {
    sqlLine+=" AND "+"GameName LIKE %"+searchText+"%";
  }
  var sqlFinal = "SELECT GameName FROM GeneralGameDescrip NATURAL JOIN Categories NATURAL JOIN Genres WHERE ";
  sqlFinal+=sqlLine;
  setSqlToInsert(sqlFinal);
  SearchFilter();
}
//when checked box
const handleOnChange = (position) => {
  const updatedChecked = checked.map((item,index) =>
    index === position ? !item : item
  );
  setChecked(updatedChecked);
};

useEffect(() => {
  Axios.get('http://localhost:3002/api/get1').then((response) => {
    setAdvQueryList1(response.data)
  })
},[]);
useEffect(() => {
  Axios.get('http://localhost:3002/api/get2').then((response) => {
    setAdvQueryList2(response.data)
  })
},[]);



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

      <div>
        <button onClick = {() => {setShowAdvQuery2(!showAdvQuery2)}}>   Display advanced query2</button>
        {showAdvQuery2? <div>
          <p>Query: </p>
          <p>SELECT GameName FROM GeneralGameDescrip NATURAL JOIN Categories NATURAL JOIN GamePurchasing </p>
          <p> WHERE CategorySinglePlayer='false' AND PriceFinal&gt;0 AND PriceFinal&lt;=</p>
          <p>&emsp;(SELECT AVG(gp.PriceFinal) FROM GamePurchasing gp join Categories ct WHERE PriceFinal&gt;0 AND ct.CategorySinglePlayer='false')</p>
          {advQueryList2.map((val) => {
          return (
            <div className = "advQuery2">
              <p>Game Name: {val.GameName}</p>
            </div>
          );          
        })}</div>:null}
      </div>
      <div>
       <button onClick = {() => {setShowAdvQuery1(!showAdvQuery1)}}>   Display advanced query1</button>
       {showAdvQuery1? <div>
        <p>Query:</p>
        <p> SELECT COUNT(GameId) AS gameCount, requiredAge </p>
        <p>FROM (SELECT * FROM GamePurchasing WHERE isFree = 'false') nonFree NATURAL JOIN Genres NATURAL JOIN GeneralGameDescrip</p>
        <p>WHERE GenreIsAction = 'true' AND PriceFinal &gt; 0 </p>
        <p>GROUP BY requiredAge </p>
        <p>ORDER BY requiredAge</p>
        {advQueryList1.map((val) => {
         return (
           <div className = "advQuery1">
             <p>Required Age: {val.requiredAge}</p>
             <p>Count: {val.gameCount}</p>
           </div>
         );          
       })}</div>:null}
      <div>
        <input type="text" name="searchTextBox" onChange={(e) => {
          setSearchText(e.target.value)
        }}/>
        <p>{searchText}</p>
      </div>
      <div>
        {GenreCategories.map((name, index) => {
          return(
            <li>
              <input
                type = "checkbox"
                id = {`box${index}`}
                checkedBox={checked[index]}
                onChange={()=>handleOnChange(index)} 
              />
              <label htmlFor={`box${index}`}>{name}</label>
            </li>
          );
        })}
        <li>
          <button onClick={()=>{Search()}}>Search</button>
        </li>
        <div>
        <h1>Filtered Game List </h1>
        {filteredGameList.map((val) => {
          return (
            <div className = "card">
              <p>Game Name:{val.GameName}</p>
            </div>
          );          
        })}
    </div>   
        <p>SQL: {sqlToInsert}</p>
        <p>{JSON.stringify(filteredGameList)}</p>
    </div>
     </div>
 
 
 
 
 
 
 
 
 
 
  </div> 
</div>
  );
}

export default App;