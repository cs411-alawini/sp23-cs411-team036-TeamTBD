import './App.css';
import React, {useState, useEffect} from "react";
import Axios from 'axios';
import StoreprocedureTable from './StoredprocedureTable';

function App() {

//useState() used to display banned game titles
//login information 
//login information 
const [UserId, setUserId] = useState();                            //stores current UserId

//userState() used to store data from updating profile
const [updateFN, setUpdateFN] = useState();                     //stores current FirstName
const [updateLN, setUpdateLN] = useState();                     //stores current LastName
const [updatePN, setUpdatePN] = useState();                     //stores current FirstName
const [updateE, setUpdateE] = useState();                       //stores current LastName
const [updateA, setUpdateA] = useState();                       //stores current LastName

const [gameReviewList, setGameIdList] = useState([]);             //stores the data returned from the query in .get() function
const [userData, setUserData] = useState([]);             //stores the data returned from the query in .get() function

//useState() used to INSERT game to BannedGameTitle Table
const [addedGameTitle, setAddedGameTitle] = useState();

//useState() used to DELETE game from BannedGameTitle Table
const [deletedGameTitle, setDeletedGameTitle] = useState();

//useState() used to UPDATE game from BannedGameTitle Table
// const [updatedGameTitle, setUpdatedGameTitle] = useState();
// const [updatedToGameTitle, setUpdatedToGameTitle] = useState();

//advQuery 1 and 2
const [advQueryList1, setAdvQueryList1] =useState([]);
const [advQueryList2, setAdvQueryList2] =useState([]);

//useState() used to display data after pressing buttons
//useState() used to display data after pressing buttons
const[showAdvQuery1, setShowAdvQuery1] = useState(false);
const[showAdvQuery2, setShowAdvQuery2] = useState(false);
const[showProfile, setShowProfile] = useState(false);
const[showPlatform, setShowPlatform] = useState(false);

const[userAge,setUserAge] = useState(0);
// const[age,setAge] = useState(0);
const numGenreCollections = 18;
const GenreCategories = ["GenreIsIndie","GenreIsAction","GenreIsAdventure","GenreIsCasual",
"GenreIsStrategy","GenreIsRPG","GenreIsSimulation","GenreIsEarlyAccess","GenreIsFreeToPlay",
"GenreIsSports","GenreIsRacing","GenreIsMassivelyMultiplayer","CategorySinglePlayer","CategoryMultiplayer",
"CategoryCoop","CategoryMMO","CategoryInAppPurchase","CategoryIsNonGame","BannedGames","UserAge"];
const[checked, setChecked]=useState(new Array(GenreCategories.length).fill(false));
const[sqlToInsert, setSqlToInsert] = useState('');
const[filteredGameList, setFilteredGameList] = useState([]);
const[searchText, setSearchText]=useState('');
const SearchFilter = (sqlText) => {
  Axios.get('http://localhost:3002/api/getFilter/', {params: {sqlToInsert: sqlText}}).then((response) => {
    setFilteredGameList(response.data)
  });
}
// Stored Proecdure stuff
const [showCode, setShowCode] = useState(false);

  const toggleCode = () => {
    setShowCode(!showCode);
  };
//When search button clicked, create SQL string and call SearchFilter
const Search = () => {
  var sqlLine = "";
  for(var i = 0; i < numGenreCollections; i++) {
    if(checked[i]===true) {
      if(sqlLine.length === 0) {
        sqlLine+=GenreCategories[i]+"='true'";
      } else {
        sqlLine+=" AND "+GenreCategories[i]+"='true'";
      }
    }
  }
  //user text includes text = "" for empty so can keep WHERE in sqlFinal
  if(searchText.length===0) {
    sqlLine+="";
  } else if(sqlLine.length === 0) {
    sqlLine+="GameName LIKE '%"+searchText+"%'";
  } else {
    sqlLine+=" AND "+"GameName LIKE '%"+searchText+"%'";
  }
  //banned game list
  if(checked[18]===true){
    for(var i = 0; i < gameReviewList.length; i++) {
      if(sqlLine.length === 0) {
        sqlLine+="GameId <>" +gameReviewList[i].GameId;
      } else {
        sqlLine+=" AND GameId <>"+gameReviewList[i].GameId;
      }
    }
  }
  var agetext = JSON.stringify(userAge);
  agetext = agetext.match(/\d+/);
  // age = parseInt(agetext);
  // setAge(age);
  if(checked[19]===true){
    if(sqlLine.length === 0) {
      sqlLine+=agetext+">=RequiredAge";
    } else {
      sqlLine+=" AND "+agetext+">=RequiredAge";
    }
  }
  var sqlFinal = "SELECT GameName, GameId FROM GeneralGameDescrip NATURAL JOIN Categories NATURAL JOIN Genres WHERE ";
  if(sqlLine.length===0){
    sqlFinal="SELECT GameName, GameId FROM GeneralGameDescrip NATURAL JOIN Categories NATURAL JOIN Genres";
  }
  sqlFinal+=sqlLine;
  setSqlToInsert(sqlFinal);
  SearchFilter(sqlFinal);
}
const getUserAge = () => {
  Axios.get('http://localhost:3002/api/getAge/', {params: {userId: UserId}}).then((response) => {
    setUserAge(response.data)
  });
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
    getUserAge()
  });
}

const DisplayUserData = () => {
  Axios.get('http://localhost:3002/api/getUserData/', {params: {userId: UserId}}).then((response) => {
    setUserData(response.data)
  });
}

const InsertTitles = (gameId, UserId) => {
  Axios.post('http://localhost:3002/api/insert', {
  userId: UserId,
  gameId: gameId
  }).then(DisplayTitles());
}

const deleteGameId = (gameId, userId) => {
  Axios.delete(`http://localhost:3002/api/delete/${gameId}/${userId}`).then(DisplayTitles());
};

const userLogin = () => {
  Axios.get('http://localhost:3002/api/getUserData/', {params: {userId: UserId}}).then((response) => {
    setUserData(response.data)
    });

    Axios.post('http://localhost:3002/api/insertUser', {
      userId: UserId
    });
    DisplayTitles()
}

const updateAll = () => {
  userData.map((val) => {
    setUpdateFN(val.FirstName);
    setUpdateLN(val.LastName);
    setUpdatePN(val.PhoneNumber);
    setUpdateE(val.EmailAddress);
  })
}

const updateUserInfo = (userId, FirstName, LastName, PhoneNumber, EmailAddress) => {
  Axios.put(`http://localhost:3002/api/updateUser/${userId}/${FirstName}/${LastName}/${PhoneNumber}/${EmailAddress}`).then(DisplayUserData());
};

const updateUsersAge = (userId, userAge) => {
  Axios.put(`http://localhost:3002/api/updateUserAge/${userId}/${userAge}`);
};

return (
  <div className="App">
  <h1>WELCOME TO PLAYRECS</h1>
  <label>Login/Signup by Typing UserId and Password!</label>
  <div className="form">
    <label> User Id:</label>
    <input type="text" name="UserId" onChange={(e) => {
      setUserId(e.target.value)
    }}/>
    <label> Password: </label>
    <input type="password" name="Password"/>
    <button onClick={() => {userLogin(); setShowPlatform(!showPlatform)}}> Login </button>
    <div>
        {/* View to display updating profile properties for the user to make changes to account */}
        {showPlatform?
        <div>
          <p> Welcome User: {UserId}</p>
          <p>Choose to Update Profile or Search for Games</p>
          <button onClick = {() => {updateAll(); setShowProfile(!showProfile)}}> Update Profile</button>
          {showProfile? 
          <div>
            <p>Updating Profile</p>
            {userData.map((val) => {
                return (
                  <div className = "card">
                    <p>First Name: {val.FirstName}</p>
                    <p>Last Name: {val.LastName}</p>
                    <p>Phone Number: {val.PhoneNumber}</p>
                    <p>Email: {val.EmailAddress}</p>
                  </div>
                );          
              })}
            {/* Text Field to store FirstName */}
            <label> First Name: </label>
            <input type="text" name="FirstName" onChange={(e) => {
              setUpdateFN(e.target.value)
            }}/>

            {/* Text Field to store LastName */}
            <label> Last Name: </label>
            <input type="text" name="LastName" onChange={(e) => {
              setUpdateLN(e.target.value)
            }}/>

            {/* Text Field to store PhoneNumber */}
            <label> Phone Number: </label>
            <input type="text" name="PhoneNumber" onChange={(e) => {
              setUpdatePN(e.target.value)
            }}/>

            {/* Text Field to store Email */}
            <label> Email Address:</label>
            <input type="text" name="Email" onChange={(e) => {
              setUpdateE(e.target.value)
            }}/>

            {/* Text Field to store Email */}
            <label> Age:</label>
            <input type="text" name="Age" onChange={(e) => {
              setUpdateA(e.target.value)
            }}/>

            <button onClick={() => {updateUserInfo(UserId, updateFN, updateLN, updatePN, updateE); updateUsersAge(UserId, updateA)}}> Update </button>

            {/* the view for displaying the "banned games" for typed user */}
            <div>
              <p>Update Banned Games Titles </p>
              {gameReviewList.map((val) => {
                return (
                  <div className = "card">
                    <p>Game Id:{val.GameId}</p>
                  </div>
                );          
              })}

              {/* the view to INSERT  */}
              <input type="text" name="addedGameTitle" onChange={(e) => {
                setAddedGameTitle(e.target.value)
              }}/>
              <button onClick={() => {InsertTitles(addedGameTitle, UserId)}}> Add Game </button>

              {/* the view to DELETE  */}
              <input type="text" name="deletedGameTitle" onChange={(e) => {
                setDeletedGameTitle(e.target.value)
              }}/>
              <button onClick={() => {deleteGameId(deletedGameTitle, UserId)}}> Delete Game </button>
            </div>

          </div>:null}
        </div>:null}
    </div>
  </div> 

  <div>
    <h2> Search Games </h2>
    <input type="text" name="searchTextBox" onChange={(e) => {
          setSearchText(e.target.value)
    }}/>
    {/* <p>{searchText}</p> */}
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
        <p>Game Id:{val.GameId}</p>
      </div>
    );          
   })}
    </div>   
        {/* <p>SQL: {sqlToInsert}</p>
        <p>{JSON.stringify(filteredGameList)}</p> 
        <p>user Age: {JSON.stringify(userAge)}</p>*/}
    </div>
    <div>
        <button onClick = {() => {setShowAdvQuery2(!showAdvQuery2)}}>   Multiplayer Games</button>
        {showAdvQuery2? <div>
          <p>Multiplayer games less than or equal to average price of all non-free multiplayer games:  </p>
          {advQueryList2.map((val) => {
          return (
            <div className = "advQuery2">
              <p>Game Name: {val.GameName}</p>
            </div>
          );          
        })}</div>:null}
        
      </div>
      <div>
       <button onClick = {() => {setShowAdvQuery1(!showAdvQuery1)}}>   Non-free Action Games</button>
       {showAdvQuery1? <div>
        <p>Number of non-free Action Games based on Age:</p>
        {advQueryList1.map((val) => {
         return (
           <div className = "advQuery1">
             <p>Required Age: {val.requiredAge}</p>
             <p>Count: {val.gameCount}</p>
           </div>
         );          
       })}</div>:null}
     </div>
    <div>
      <button onClick={toggleCode}>View Steam Game Statistics </button>
      {showCode && (
        <div className='storeprocedure'>
          <StoreprocedureTable />
        </div>
      )}
    </div>
    
  </div>
  
  );
}
  
  export default App;