import { TOKEN_DATA } from "../../storage/actions/actionTypes.js";
import { HOME_PATH } from "../../constants/RoutingPaths";
import store from "./../../storage/storage";

export function fillStorage(token) {
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

export function fillLocalStorage(token, refreshToken) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
}

export function logout(history) {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  store.dispatch({
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
