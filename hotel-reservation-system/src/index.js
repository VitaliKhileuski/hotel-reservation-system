import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import storage from "./storage/storage";

ReactDOM.render(
  <Provider store={storage}>
    <>
      <App />
    </>
  </Provider>,
  document.getElementById("root")
);
