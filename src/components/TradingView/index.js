import React, { useEffect, useState } from "react";
import NativeSelect from "@material-ui/core/NativeSelect";

import { bnbAddress, ethAddress } from "constants/addresses";

import DataFeed from "./datafeed";

const TradingView = ({
  symbol,
  address,
  chartId = "home",
  disableFeatures = [],
  compareSymbol = "USD",
  compareAddress,
  disableCompareSelect,
  currencySymbol = "$",
  network = "bsc",
}) => {
  const altSymbol = network === "bsc" ? "BNB" : "ETH";
  const compares = [
    {
      symbol: compareSymbol,
    },
    {
      symbol: altSymbol,
    },
  ];
  const [compare, setCompare] = useState(compareSymbol);
  useEffect(() => {
    const widgetOptions = {
      // debug: true, // uncomment this line to see Library errors and warnings in the
      symbol: `${symbol}/${compare}`,
      interval: 15,

      container_id: `tv_chart_container-${chartId}`,

      //  BEWARE: no trailing slash is expected in feed URL
      datafeed: DataFeed({
        symbolAddress:
          symbol === altSymbol
            ? network === "bsc"
              ? bnbAddress
              : ethAddress
            : address,
        compare,
        compareAddress,
        currencySymbol,
        network,
      }),
      library_path: "/charting_library/",
      locale: "en",

      disabled_features: [
        "use_localstorage_for_settings",
        "header_symbol_search",
        ...disableFeatures,
      ],
      enabled_features: [],
      charts_storage_api_version: "1.0",
      client_id: 0,
      user_id: 0,
      theme: "dark",
      autosize: true,
      overrides: {
        "paneProperties.background": "#131722",
        "paneProperties.vertGridProperties.color": "#363c4e",
        "paneProperties.horzGridProperties.color": "#363c4e",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#AAA",
        "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
        "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f",
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7,
      },

      // custom_css_url: "/charting_library/chart.css",
    };
    const widget = new window.TradingView.widget(widgetOptions);
    window.tvWidget = undefined;
    widget.onChartReady(async () => {
      setTimeout(() => {
        window.tvWidget = widget;
        window.tvWidget.compare = compareSymbol;
      }, 1500);
      // widget._options.width = 1000;
      window.chart = widget.chart();
      window.chart.createStudy("Bollinger Bands", true, false, [20, 2]);
      window.chart.setChartType(8);
      console.log("chart option", window.chart);
      console.log("Chart has loaded!");
    });
  }, []);

  useEffect(() => {
    if (symbol === altSymbol) {
      setCompare(compareSymbol);
      if (window.tvWidget) {
        window.tvWidget.compare = compareSymbol;
      }
    }
  }, [symbol]);

  useEffect(() => {
    // console.log(symbol);
    if (window.tvWidget) {
      const { interval } = window.tvWidget.symbolInterval();
      window.tvWidget.compare = compare;
      window.tvWidget.symbolAddress = address;
      window.tvWidget.setSymbol(`${symbol}/${compare}`, interval);
    }
  }, [symbol, compare, address]);

  return (
    <div className="trading-view-container">
      <article
        id={`tv_chart_container-${chartId}`}
        style={{ width: "100%", height: "100%" }}
      />
      {!disableCompareSelect && (
        <NativeSelect
          onChange={({ target: { value } }) => setCompare(value)}
          inputProps={{
            name: "compare",
            id: "compare-native-helper",
          }}
          className="compare-select"
          value={compare}
        >
          {compares.map(({ symbol }) => (
            <option value={symbol} key={symbol}>
              {symbol}
            </option>
          ))}
        </NativeSelect>
      )}
    </div>
  );
};

export default TradingView;
