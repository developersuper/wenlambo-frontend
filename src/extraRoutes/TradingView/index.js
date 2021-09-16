import React from "react";
import queryString from "query-string";
import { useQuery } from "@apollo/react-hooks";

import { default as TradingViewComponent } from "components/TradingView";
import { SEARCH_TOKEN } from "queries/history";

import "./index.scss";

const TradingView = () => {
  const { currency } = queryString.parse(window.location.search);
  const { data, loading } = useQuery(SEARCH_TOKEN, {
    variables: {
      address: currency,
    },
  });
  const symbol = data?.searchToken?.symbol;
  if (!symbol) return null;
  return (
    <div className="trading-view-wrapper">
      <TradingViewComponent
        symbol={symbol}
        address={currency}
        disableFeatures={["left_toolbar", "header_compare", "header_undo_redo"]}
      />
    </div>
  );
};

export default TradingView;
