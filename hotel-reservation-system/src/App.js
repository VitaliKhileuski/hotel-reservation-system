import { React, useEffect } from "react";
import NavBar from "./components/shared/NavBar";
import Login from "./components/Authorization/Login";
import Register from "./components/Authorization/Register";
import Home from "./components/Home";
import API from "./api";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IS_LOGGED,
  NAME,
  ROLE,
  EMAIL,
  USER_ID,
} from "./storage/actions/actionTypes";
import RouteList from "./Routing/RouteList";
import HotelTable from "./components/Hotel/HotelTable";
import HotelEditor from "./components/Hotel/HotelEditor";
import RoomsPage from "./components/Room/RoomsPage";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import OrderTable from "./components/Reservation/OrderTable";

export default function App() {
  const dispatch = useDispatch();

  const refreshAuthLogic = async (failedRequest) =>
    await API.put("/account/refreshTokenVerification", {
      Token: localStorage.getItem("refreshToken"),
    })
      .then((tokenRefreshResponse) => {
        localStorage.setItem("token", tokenRefreshResponse.data[0]);
        localStorage.setItem("refreshToken", tokenRefreshResponse.data[1]);
        failedRequest.response.config.headers["Authorization"] =
          "Bearer " + tokenRefreshResponse.data[0];
        updateStorage(tokenRefreshResponse.data[0]);
        return Promise.resolve();
      })
      .catch((error) => {
        logout();
      });

  createAuthRefreshInterceptor(API, refreshAuthLogic);

  async function tokenVerification() {
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      updateStorage(token);
      let result;
      try {
        result = await API.get("/account/tokenVerification", {
          headers: {
            Authorization: "Bearer " + token,
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (e) {}
    } else {
      logout();
    }
  }
  function logout() {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    dispatch({ type: IS_LOGGED, isLogged: false });
    dispatch({ type: ROLE, role: "" });
    dispatch({ type: EMAIL, email: "" });
    dispatch({ type: NAME, name: "" });
  }

  useEffect(() => {
    tokenVerification();
  }, []);

  async function updateStorage(token) {
    const jwt = JSON.parse(atob(token.split(".")[1]));
    dispatch({ type: IS_LOGGED, isLogged: true });
    dispatch({ type: USER_ID, userId: jwt.id });
    dispatch({ type: NAME, name: jwt.firstname });
    dispatch({ type: EMAIL, email: jwt.email });
    dispatch({ type: ROLE, role: jwt.role });
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <RouteList></RouteList>
      </div>
    </Router>
  );
}
