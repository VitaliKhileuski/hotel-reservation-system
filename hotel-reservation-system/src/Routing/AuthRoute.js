import { React, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthRoute({
  Component,
  path,
  exact = false,
  requiredRoles,
}) {
  console.log(Component);
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
          <Redirect to="/home" />
        )
      }
    />
  );
}
