import { React, useEffect } from "react";
import { useHistory } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { ALERT_INFO } from "./storage/actions/actionTypes";
import { fillStorage, logout } from "./components/Authorization/TokenData";
import BaseAlert from "./components/shared/BaseAlert";
import RouteList from "./Routing/RouteList";
import NavBar from "./components/shared/NavBar";
import API from "./api";

export default function App() {
  const dispatch = useDispatch();
  const history = useHistory();

  function handleCloseAlert() {
    dispatch({ type: ALERT_INFO, openAlert: false, alertSuccessStatus : true });
  }

  const refreshAuthLogic = async (failedRequest) =>
    await API.put("/account/refreshTokenVerification", {
      Token: localStorage.getItem("refreshToken"),
    })
      .then((tokenRefreshResponse) => {
        localStorage.setItem("token", tokenRefreshResponse.data[0]);
        localStorage.setItem("refreshToken", tokenRefreshResponse.data[1]);
        failedRequest.response.config.headers["Authorization"] =
          "Bearer " + tokenRefreshResponse.data[0];
        fillStorage(tokenRefreshResponse.data[0]);
        return Promise.resolve();
      })
      .catch((error) => {
        logout(history);
      });

  createAuthRefreshInterceptor(API, refreshAuthLogic);

  async function tokenVerification() {
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      fillStorage(token);
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
      logout(history);
    }
  }

  useEffect(() => {
    tokenVerification();
  }, []);

  return (
    <Router>
      <div className="App">
        <NavBar />
        <RouteList></RouteList>
        <BaseAlert
          handleClose={handleCloseAlert}
          alertInfo={useSelector((state) => state.alertInfo)}
        ></BaseAlert>
      </div>
    </Router>
  );
}
