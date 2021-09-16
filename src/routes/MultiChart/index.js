import React from "react";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";

import Indicator from "components/Indicator";
import TopAds from "components/TopAds";
import { TRENDS } from "queries/history";

import SingleChart from "./components/SingleChart";

const MultiChart = () => {
  const premium = useSelector((state) => state.account?.lp?.premium);
  const { data, loading } = useQuery(TRENDS, {
    variables: {
      since: moment().add(-1, "months").format("YYYY-MM-DD"),
      limit: premium ? 18 : 8,
    },
  });
  return (
    <>
      <TopAds />
      <Grid container className="multi-chart">
        <Grid item xs={12}>
          {loading ? <Indicator loading={loading} /> : null}
        </Grid>
        {data?.trends?.map((trend, index) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={trend.address}
            className="multi-chart-item"
          >
            <SingleChart defaultCurreny={trend} chartId={index} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default MultiChart;
