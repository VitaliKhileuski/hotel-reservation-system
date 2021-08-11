import { TOKEN_DATA } from "../../storage/actions/actionTypes.js";
import { HOME_PATH } from "../../constants/RoutingPaths";
import store from "./../../storage/storage";

export function FillStorage(token) {
  const jwt = JSON.parse(atob(token.split(".")[1]));
  store.dispatch({
    type: TOKEN_DATA,
    isLogged: true,
    role: jwt.role,
    userId: jwt.id,
    email: jwt.email,
    name: jwt.firstname,
  });
}

export function FillLocalStorage(token, refreshToken) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
}

export function Logout(dispatch, history) {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  dispatch({
    type: TOKEN_DATA,
    isLogged: false,
    role: "",
    userId: "",
    email: "",
    name: "",
  });

  if (!!history) {
    history.push({
      pathname: HOME_PATH,
    });
  }
}
export function getRole(token) {
  return JSON.parse(atob(token.split(".")[1])).role;
}
