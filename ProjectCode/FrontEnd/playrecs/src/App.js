import './App.css';
import React, {useState, useEffect} from "react";
import Axios from 'axios';
function App() {
  return (
  <div className="App">
      <h1> CRUD APPLICATIONS</h1>
      <div className="form">
        <label> Movie Name:</label>
        <input type="text" name="movieName" />
        <label> Review:</label>
        <input type="text" name="Review" />
        <button> Submit</button>
</div>
</div>
); }
export default App;
