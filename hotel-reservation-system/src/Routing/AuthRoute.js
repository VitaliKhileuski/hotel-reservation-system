import { React } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { NOT_AUTHORIZED_ERROR_PATH, FORBIDDEN_ERROR_PATH } from './../constants/RoutingPaths'

export default function AuthRoute({
  Component,
  path,
  exact = false,
  requiredRoles,
}) {
  const token = localStorage.getItem("token");
  const isAuthed = !!token;
  const role = !!token ? JSON.parse(atob(token.split(".")[1])).role : null;
  let userHasRequireRole = !!requiredRoles
    ? requiredRoles.includes(role)
    : true;

  return (
    <Route
      path={path}
      exact={exact}
      render={(props) =>
        isAuthed && userHasRequireRole ? (
          <Component {...props} />
        ) : (
         !isAuthed ? <Redirect to={NOT_AUTHORIZED_ERROR_PATH} />
         : <Redirect to={FORBIDDEN_ERROR_PATH}></Redirect>
        )
      }
    />
  );
}
