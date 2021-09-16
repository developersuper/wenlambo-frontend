import {
  ADD_WALLET,
  UPDATE_WALLET,
  REMOVE_WALLET,
  ADD_TOKEN,
  REMOVE_TOKEN,
  UPDATE_BLACKLIST,
  SET_NETWORK,
} from "constants/actionTypes";

export const addWallet = (wallet) => {
  return { type: ADD_WALLET, wallet };
};

export const updateWallet = (wallet) => {
  return { type: UPDATE_WALLET, wallet };
};

export const removeWallet = (wallet) => {
  return { type: REMOVE_WALLET, wallet };
};

export const addToken = (token) => {
  return { type: ADD_TOKEN, token };
};

export const removeToken = (token) => {
  return { type: REMOVE_TOKEN, token };
};

export const updateBlackList = (blackList) => {
  return { type: UPDATE_BLACKLIST, blackList };
};

export const setNetwork = (network) => {
  return { type: SET_NETWORK, network };
};
