import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import {Provider as ReduxProvider} from "react-redux";
import App from "./App";
import {store} from "./store";
import "./assets/fonts/lato.css";
import "./assets/styles.css";

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Router>
        <App />
      </Router>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
