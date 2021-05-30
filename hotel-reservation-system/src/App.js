import {React, useEffect} from "react";
import NavBar from "./components/shared/NavBar";
import Login from "./components/Authorization/Login";
import Register from "./components/Authorization/Register";
import Home from "./components/Home"
import API from './api'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { IS_LOGGED, NAME} from "./storage/actions/actionTypes";


export default function App() {

  const dispatch = useDispatch();

  async function tokenVerification() {
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");

      let result;
      
      try{
        result = await API.get('/account/tokenVerification', {
          headers: { Authorization: "Bearer " + token,
          'Access-Control-Allow-Origin' : '*'},
        });
      } catch(e){
        if (e.response === undefined) {
          if(localStorage.getItem("refreshToken") !== undefined){
            result = await API.put('/account/refreshTokenVerification', { Token : localStorage.getItem("refreshToken")});
          }   
        }
      }

      if (result !== undefined && result.status === 200) {
        if(result.data === null){
          const jwt = JSON.parse(atob(token.split(".")[1]));
          dispatch({ type: NAME, name: jwt.firstname });
          localStorage.setItem("token", token);
          dispatch({ type: IS_LOGGED, isLogged: true });
        }else{
          localStorage.setItem('token',result.data[0]);
          localStorage.setItem('refreshToken',result.data[1]);
          const jwt = JSON.parse(atob(result.data[0].split(".")[1]));
          dispatch({ type: IS_LOGGED, isLogged: true });
          dispatch({type : NAME, name : jwt.firstname});
        }
      } else {
        localStorage.removeItem("refreshToken");
          localStorage.removeItem("token");
          dispatch({ type: IS_LOGGED, isLogged: false });
      }
    }else{
      if(localStorage.getItem("refreshToken") !== undefined){
        const result = await API.put('account/refreshTokenVerification', { refreshToken : localStorage.getItem("refreshToken")});

        if (result !== undefined && result.status === 200) {
          localStorage.setItem('token',result.data[0]);
          localStorage.setItem('refreshToken',result.data[1]);
          const jwt = JSON.parse(atob(result.data[0].split(".")[1]));
          dispatch({ type: IS_LOGGED, isLogged: true });
          dispatch({type : NAME, name : jwt.firstname});
          }
        } else {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("token");
          dispatch({ type: IS_LOGGED, isLogged: false });
        }
      }  
  }
    useEffect(() => {
      tokenVerification();
    }, []);
  
    return (
      <Router>
        <div className="App">
          <NavBar/>
          <Switch>
            <Route path="/login" component = {Login} />
            <Route path="/register" component = {Register}/>
            <Route path ="/home" component = {Home}/>
            <Redirect to="/home" />
          </Switch>
        </div>
      </Router>
    );
}
