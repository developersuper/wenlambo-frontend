import React, { useState } from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";

import Indicator from "components/Indicator";
import SymbolFinder from "components/SymbolFinder";
import TradingView from "components/TradingView";
import TradeHistory from "components/TradeHistory";

const PairExplorer = () => {
  const [token1, setToken1] = useState(null);
  const [token2, setToken2] = useState(null);
  const network = useSelector((state) => state.favorites?.network);
  return (
    <div className="pair-explorer">
      <div className="pair-explorer-header">
        <Typography variant="h6" className="title" component="h6">
          Pair Explorer
        </Typography>
      </div>
      <Indicator />
      <div className="symbol-finders">
        <SymbolFinder
          setCurrency={setToken1}
          currency={token1}
          title="Symbol1"
          quote={token2?.address}
          groupBy={
            token2?.symbol
              ? ({ count }) =>
                  count > 0 ? "" : `No Transactions with ${token2?.symbol}`
              : undefined
          }
        />
        <SymbolFinder
          setCurrency={setToken2}
          currency={token2}
          title="Symbol2"
          base={token1?.address}
          groupBy={
            token1?.symbol
              ? ({ count }) =>
                  count > 0 ? "" : `No Transactions with ${token1?.symbol}`
              : undefined
          }
        />
      </div>
      {token1?.symbol && token2?.symbol && (
        <div className="trading-view-wrapper">
          <TradingView
            key={`${token1?.address} || ${token2?.address}`}
            symbol={token1.symbol}
            address={token1.id || token1.address}
            disableFeatures={[
              "left_toolbar",
              "header_compare",
              "header_undo_redo",
            ]}
            compareSymbol={token2.symbol}
            compareAddress={token2.id || token2.symbol}
            disableCompareSelect
            chartId={`tools-pair-explorer-${token1?.address}-${token2?.address}`}
            network={network}
          />
        </div>
      )}
      {token1?.symbol && token2?.symbol && (
        <TradeHistory
          key={`${token1?.address} || ${token2?.address}`}
          symbol={token1?.symbol}
          address={token1?.address}
          quoteSymbol={token2?.symbol}
          quoteAddress={token2?.address}
          currencySymbol="$"
          hideTitle
          hideWalletShow
        />
      )}
    </div>
  );
};

export default PairExplorer;
