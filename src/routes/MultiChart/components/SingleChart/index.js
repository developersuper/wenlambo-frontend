import React, { useState } from "react";
import { useSelector } from "react-redux";

import Paper from "components/Paper";
import SymbolFinder from "components/SymbolFinder";
import TradingView from "components/TradingView";

const SingleChart = ({ defaultCurreny, chartId }) => {
  const [currency, setCurrency] = useState(defaultCurreny);
  const network = useSelector((state) => state.favorites?.network);
  return (
    <Paper expandable color="dark" className="single-chart-tradingview">
      <div className="input-symbol">
        <SymbolFinder setCurrency={setCurrency} currency={currency} />
      </div>
      <div className="single-chart-container">
        <TradingView
          address={currency.id || currency.address}
          symbol={currency.symbol}
          chartId={chartId}
          key={currency.symbol}
          disableFeatures={[
            "left_toolbar",
            "header_compare",
            "header_undo_redo",
          ]}
          network={network}
        />
      </div>
    </Paper>
  );
};

export default SingleChart;
