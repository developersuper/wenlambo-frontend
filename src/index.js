import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";

import apolloClient from "config/createApolloClient";
import "styles/index.scss";

import Routes from "routes";
import TradingView from "extraRoutes/TradingView";
import reportWebVitals from "./reportWebVitals";

const {
  location: { pathname },
} = window;

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <React.StrictMode>
      {pathname === "/trading-view" ? <TradingView /> : <Routes />}
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
