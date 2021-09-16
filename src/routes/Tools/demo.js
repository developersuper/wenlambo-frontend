import React from "react";
import Grid from "@material-ui/core/Grid";

import Paper from "components/Paper";
import TopAds from "components/TopAds";

import ContractEvents from "./components/ContractEvents";
import PairExplorer from "./components/PairExplorer";
import TopGainers from "./components/TopGainers";

const Tools = () => {
  return (
    <>
      <Grid className="tools" container spacing={1} justify="center">
        <Grid item xs={12} className="tools-section tiny logo-container">
          <TopAds />
        </Grid>
        <Grid item xs={12} className="content">
          <Grid container>
            <Grid item xs={12} md={6} className="tools-section big">
              <Paper expandable color="dark">
                <TopGainers />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} className="tools-section big">
              <Paper expandable color="dark">
                <TopGainers isLoser />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} className="tools-section big">
              <Paper expandable color="dark">
                <ContractEvents />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} className="tools-section big">
              <Paper expandable color="dark">
                <PairExplorer />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Tools;
