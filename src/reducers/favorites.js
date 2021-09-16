import { uniqBy } from "lodash";

import {
  ADD_WALLET,
  UPDATE_WALLET,
  REMOVE_WALLET,
  ADD_TOKEN,
  REMOVE_TOKEN,
  UPDATE_BLACKLIST,
  SET_NETWORK,
} from "constants/actionTypes";

const initialState = {
  wallets: JSON.parse(localStorage.getItem("favoriteWallets") || "[]"),
  tokens: JSON.parse(localStorage.getItem("favoriteTokens") || "[]"),
  blackList: JSON.parse(localStorage.getItem("blackList") || "[]"),
  network: localStorage.getItem("network") || "bsc",
};

const favorites = (state = initialState, action) => {
  let newState = state;
  let newWallets, newTokens;
  switch (action.type) {
    case ADD_WALLET:
      newWallets = uniqBy([...state.wallets, action.wallet], "address");
      localStorage.setItem("favoriteWallets", JSON.stringify(newWallets));
      newState = {
        ...state,
        wallets: newWallets,
      };
      return newState;
    case REMOVE_WALLET:
      newWallets = state.wallets.filter(
        ({ address }) => address !== action.wallet.address
      );
      localStorage.setItem("favoriteWallets", JSON.stringify(newWallets));
      newState = {
        ...state,
        wallets: newWallets,
      };
      return newState;
    case UPDATE_WALLET:
      newWallets = state.wallets.map(({ address, ...rest }) =>
        address === action.wallet.address ? action.wallet : { address, ...rest }
      );
      localStorage.setItem("favoriteWallets", JSON.stringify(newWallets));
      newState = {
        ...state,
        wallets: newWallets,
      };
      return newState;
    case ADD_TOKEN:
      newTokens = uniqBy([...state.tokens, action.token], "address");
      localStorage.setItem("favoriteTokens", JSON.stringify(newTokens));
      newState = {
        ...state,
        tokens: newTokens,
      };
      return newState;
    case REMOVE_TOKEN:
      newTokens = state.tokens.filter(
        ({ address }) => address !== action.token.address
      );
      localStorage.setItem("favoriteTokens", JSON.stringify(newTokens));
      newState = {
        ...state,
        tokens: newTokens,
      };
      return newState;
    case UPDATE_BLACKLIST:
      const newBlackList = action.blackList;
      localStorage.setItem("blackList", JSON.stringify(newBlackList));
      newState = {
        ...state,
        blackList: newBlackList,
      };
      return newState;
    case SET_NETWORK:
      localStorage.setItem("network", action.network);
      newState = {
        ...state,
        network: action.network,
      };
      return newState;
    default:
      return newState;
  }
};

export default favorites;
