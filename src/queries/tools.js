import gql from "graphql-tag";

export const TOP_GAINERS = gql`
  query ($minutes: Int, $limit: Int, $isLoser: Boolean) {
    topGainers(minutes: $minutes, limit: $limit, isLoser: $isLoser) {
      address
      name
      symbol
      price
      volume
      increase
    }
  }
`;

export const CONTRACT_EVENTS = gql`
  query ($limit: Int) {
    contractEvents(limit: $limit) {
      event
      unixtime
      currency {
        name
        symbol
        address
      }
    }
  }
`;

export const BNB_PRICE = gql`
  query ($currency: String) {
    bnbPrice(currency: $currency)
  }
`;

export const DEV_ACTIVITIES = gql`
  query ($token: String) {
    devActivities(token: $token) {
      time
      address
      contractType
      currency {
        address
        symbol
      }
      amount
      hash
    }
  }
`;


export const RUGPULL = gql`
  query ($contract: String) {
    rugPull(contract: $contract){
      transferAllFunds
      mintAllowed
      totalFunctions
      whitelistFunctions
      transferSafe
    }
  }
`;