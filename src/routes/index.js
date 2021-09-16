import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import MainApp from "components/MainApp";
import { store } from "config/store";

import Home from "./Home";
import BuyLambo from "./BuyLambo";
import MultiChart from "./MultiChart";
import Premium from "./Premium";
import Promote from "./Promote";
import RugDetector from "./RugDetector";
import Tools from "./Tools";
import ToolsDemo from "./Tools/demo";

const Routes = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainApp>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/buy-lambo" component={BuyLambo} />
            <Route exact path="/multi-chart" component={MultiChart} />
            <Route exact path="/premium" component={Premium} />
            <Route exact path="/promote" component={Promote} />
            <Route exact path="/rug-detector" component={RugDetector} />
            <Route exact path="/tools" component={Tools} />
            <Route exact path="/tools-test-beta" component={ToolsDemo} />
          </Switch>
        </MainApp>
      </BrowserRouter>
    </Provider>
  );
};

export default Routes;
