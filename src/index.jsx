import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import reloadMagic from "./reload-magic-client.js";
import App from "./App.jsx";
import store from "./store.js";
import "./main.css";
reloadMagic();
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
