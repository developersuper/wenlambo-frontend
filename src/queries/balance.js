import gql from "graphql-tag";

export const BALANCES = gql`
  query ($walletAddress: String!, $currency: String) {
    balances(walletAddress: $walletAddress, currency: $currency) {
      value
      bnbValue
      currency {
        address
        name
        symbol
        price
        logo
      }
    }
  }
`;

export const LAMBO_LP = gql`
  query ($walletAddress: String) {
    lamboLP(walletAddress: $walletAddress) {
      usdValue
      percentage
      lpHolding
    }
  }
`;
