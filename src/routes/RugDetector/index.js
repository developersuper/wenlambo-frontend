import React from "react";
import Grid from "@material-ui/core/Grid";

import Paper from "components/Paper";
import TopAds from "components/TopAds";

import RugChecker from "./components/RugChecker";
import ContractScanner from "./components/ContractScanner";

const RugDetector = () => {
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
                <RugChecker />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} className="tools-section big">
              <Paper expandable color="dark">
                <ContractScanner />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RugDetector;
