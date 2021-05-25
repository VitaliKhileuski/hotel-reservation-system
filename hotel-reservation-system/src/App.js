import React from "react";
import NavBar from "./components/shared/NavBar";
import Login from "./components/Authorization/Login";
import Register from "./components/Authorization/Register";
import Home from "./components/Home"
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
function App() {

  return (
    <Router>
      <div className="App">
        <NavBar/>
        <Switch>
          <Route path="/login" component = {Login} />
          <Route path="/register" component = {Register}/>
          <Route path ="/home" component = {Home}/>
        </Switch>
      </div>
    </Router>
  );
  }
export default App;
