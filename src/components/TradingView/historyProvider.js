import { candleData } from "queries/history";

import {
  bnbAddress,
  ethAddress,
  busdAddress,
  usdtAddress,
} from "constants/addresses";

const history = {};

export default {
  history: history,
  getBars: async (symbolInfo, resolution, from, to, first, limit) => {
    const altSymbol = symbolInfo.network === "bsc" ? "BNB" : "ETH";
    const addr1 = symbolInfo?.network === "bsc" ? bnbAddress : ethAddress;
    const addr2 = symbolInfo?.network === "bsc" ? busdAddress : usdtAddress;
    const bars = await candleData({
      baseCurrency: symbolInfo.symbolAddress,
      quoteCurrency: symbolInfo.compareAddress
        ? symbolInfo.compareAddress
        : symbolInfo.compare === altSymbol
        ? addr1
        : addr2,
      currency: symbolInfo.currencySymbol,
      since: from * 1000,
      till: to * 1000,
      window: resolution === "1D" ? 1440 : Number(resolution),
    });
    return bars;
  },
};
