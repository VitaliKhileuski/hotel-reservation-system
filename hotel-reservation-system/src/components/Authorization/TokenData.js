import {
  IS_LOGGED,
  NAME,
  ROLE,
  USER_ID,
  EMAIL,
} from "../../storage/actions/actionTypes.js";

export function FillStorage(token, dispatch) {
  const jwt = JSON.parse(atob(token.split(".")[1]));
  dispatch({ type: IS_LOGGED, isLogged: true });
  dispatch({ type: USER_ID, userId: jwt.id });
  dispatch({ type: EMAIL, email: jwt.email });
  dispatch({ type: NAME, name: jwt.firstname });
  dispatch({ type: ROLE, role: jwt.role });
}
export function FillLocalStorage(token, refreshToken) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
}
export function Logout(dispatch, history) {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  dispatch({ type: IS_LOGGED, isLogged: false });
  dispatch({ type: USER_ID, userId: "" });
  dispatch({ type: ROLE, role: "" });
  dispatch({ type: EMAIL, email: "" });
  dispatch({ type: NAME, name: "" });
  history.push({
    pathname: "/home",
  });
}