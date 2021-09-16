import { tokens } from "queries/history";

import historyProvider from "./historyProvider";

const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "720",
  "D",
];

const config = {
  supported_resolutions: supportedResolutions,
};

const DataFeed = (options) => {
  return {
    onReady: (cb) => {
      console.log("=====onReady running");
      setTimeout(() => cb(config), 0);
    },
    searchSymbols: async (
      userInput,
      exchange,
      symbolType,
      onResultReadyCallback
    ) => {
      console.log("====Search Symbols running");
      const allTokens = await tokens({ search: userInput.split("/")[0] });
      onResultReadyCallback(
        allTokens.map(({ name, address, symbol }) => ({
          symbol: `${symbol}/${window.tvWidget.compare}`,
          description: name,
          ticker: options.network.toUpperCase(),
          exchange: "Wen Lambo",
          type: "crypto",
        }))
      );
    },
    resolveSymbol: (
      symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback
    ) => {
      // expects a symbolInfo object in response
      console.log("======resolveSymbol running", symbolName);
      // console.log('resolveSymbol:',{symbolName})
      var symbolNameOnly = symbolName.split(":").slice(-1)[0];
      var symbolNameExtend = symbolNameOnly.split("/")[1]
        ? symbolNameOnly
        : `${symbolNameOnly}/${window.tvWidget.compare}`;
      var split_data = symbolNameExtend.split("/");
      var symbol_stub = {
        name: symbolNameExtend,
        description: symbolNameExtend,
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        ticker: symbolNameExtend,
        exchange: "Wen Lambo",
        has_intraday: true,
        supported_resolution: supportedResolutions,
        volume_precision: 8,
        data_status: "streaming",
        options,
        minmov: 1,
        pricescale: 1000000000000000,
      };

      if (split_data[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
        symbol_stub.pricescale = 1000000000;
      }
      setTimeout(function () {
        onSymbolResolvedCallback(symbol_stub);
        console.log("Resolving that symbol....", symbol_stub);
      }, 0);

      // onResolveErrorCallback('Not feeling it today')
    },
    getBars: async function (
      symbolInfo,
      resolution,
      from,
      to,
      onHistoryCallback,
      firstDataRequest
    ) {
      // console.log('function args',arguments)
      // console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
      try {
        const bars = await historyProvider.getBars(
          {
            ...symbolInfo,
            symbolAddress:
              window.tvWidget?.symbolAddress || options?.symbolAddress,
            compare: window.tvWidget?.compare || options?.compare,
            compareAddress:
              window.tvWidget?.compareAddress || options?.compareAddress,
            currencySymbol: options.currencySymbol,
            network: options.network,
          },
          resolution,
          from,
          to,
          firstDataRequest
        );
        const barsNormalized = bars.map(({ time, ...rest }) => ({
          ...rest,
          time: time * 1000,
        }));
        if (barsNormalized.length) {
          onHistoryCallback(barsNormalized, { noData: false });
        } else {
          onHistoryCallback(barsNormalized, { noData: true });
        }
      } catch (err) {
        console.log({ err });
      }
    },
    subscribeBars: (
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback
    ) => {
      console.log("=====subscribeBars runnning");
    },
    unsubscribeBars: (subscriberUID) => {
      console.log("=====unsubscribeBars running");
    },
    calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
      //optional
      console.log("=====calculateHistoryDepth running");
      // while optional, this makes sure we request 24 hours of minute data at a time
      // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
      return resolution < 60
        ? { resolutionBack: "D", intervalBack: "1" }
        : undefined;
    },
    getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
      //optional
      console.log("=====getMarks running");
    },
    getTimeScaleMarks: (
      symbolInfo,
      startDate,
      endDate,
      onDataCallback,
      resolution
    ) => {
      //optional
      console.log("=====getTimeScaleMarks running");
    },
    getServerTime: (cb) => {
      console.log("=====getServerTime running");
    },
  };
};

export default DataFeed;
