import gql from "graphql-tag";

import { runQuery } from "./index";

export const CANDLE_DATA = gql`
  query (
    $baseCurrency: String!
    $quoteCurrency: String!
    $since: String!
    $till: String!
    $window: Int!
  ) {
    candleData(
      baseCurrency: $baseCurrency
      quoteCurrency: $quoteCurrency
      since: $since
      till: $till
      window: $window
    ) {
      time
      volumn
      high
      low
      open
      close
    }
  }
`;

export const TRADES = gql`
  query (
    $address: String!
    $quoteAddress: String
    $limit: Int
    $currency: String
    $wallet: String
  ) {
    trades(
      address: $address
      quoteAddress: $quoteAddress
      limit: $limit
      currency: $currency
      wallet: $wallet
    ) {
      side
      txHash
      time
      buyAmount
      sellAmount
      amountInUSD
      taker
      count
      amount
    }
  }
`;

export const TRENDS = gql`
  query ($since: String!, $currency: String, $limit: Int) {
    trends(since: $since, currency: $currency, limit: $limit) {
      name
      address
      symbol
      price
    }
  }
`;

export const QUOTE_PRICE = gql`
  query ($from: String!, $to: String!) {
    quotePrice(from: $from, to: $to)
  }
`;

export const TOKEN_INFO = gql`
  query ($address: String!, $currency: String) {
    tokenInfo(address: $address, currency: $currency) {
      totalSupply
      transfers
      marketCap
      marketBnbCap
      price
      totalLiquidityUSD
      totalLiquidityBNB
    }
  }
`;

export const SEARCH_TOKEN = gql`
  query ($address: String!) {
    searchToken(address: $address) {
      name
      symbol
      address
    }
  }
`;

export const candleData = ({
  baseCurrency,
  quoteCurrency,
  since,
  till,
  window,
  currency,
}) =>
  runQuery(
    `
    {
      candleData(
        baseCurrency: "${baseCurrency}"
        quoteCurrency: "${quoteCurrency}"
        since: "${since}"
        till: "${till}"
        window: ${window}
        currency: "${currency}"
      ) {
        time
        volume
        high
        low
        open
        close
      }
    }
  `,
    "candleData"
  );

export const tokens = ({ search, base, quote }) =>
  runQuery(
    `
  {
    tokens(
      search: "${search}",
      base: "${base || ""}",
      quote: "${quote || ""}",
    ) {
      name
      symbol
      address
      count
    }
  }
`,
    "tokens"
  );
