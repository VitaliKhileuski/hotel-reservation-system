import { React, useEffect } from "react";
import { useHistory } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { ALERT_INFO } from "./storage/actions/actionTypes";
import { FillStorage, Logout } from "./components/Authorization/TokenData";
import BaseAlert from "./components/shared/BaseAlert";
import RouteList from "./Routing/RouteList";
import NavBar from "./components/shared/NavBar";
import API from "./api";

export default function App() {
  const dispatch = useDispatch();
  const history = useHistory();

  function handleCloseAlert() {
    dispatch({ type: ALERT_INFO, openAlert: false });
  }

  useSelector((state) => console.log(state));

  const refreshAuthLogic = async (failedRequest) =>
    await API.put("/account/refreshTokenVerification", {
      Token: localStorage.getItem("refreshToken"),
    })
      .then((tokenRefreshResponse) => {
        localStorage.setItem("token", tokenRefreshResponse.data[0]);
        localStorage.setItem("refreshToken", tokenRefreshResponse.data[1]);
        failedRequest.response.config.headers["Authorization"] =
          "Bearer " + tokenRefreshResponse.data[0];
        FillStorage(tokenRefreshResponse.data[0], dispatch);
        return Promise.resolve();
      })
      .catch((error) => {
        Logout(dispatch, history);
      });

  createAuthRefreshInterceptor(API, refreshAuthLogic);

  async function tokenVerification() {
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      FillStorage(token, dispatch);
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
      Logout(dispatch, history);
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
