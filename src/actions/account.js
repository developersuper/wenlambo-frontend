import {
  SET_ACCOUNT_ADDRESS,
  SET_ACCOUNT_BALANCES,
  SET_LP,
} from "constants/actionTypes";

export const setAccountAddress = (address) => {
  return { type: SET_ACCOUNT_ADDRESS, address };
};

export const setAccountBalances = (balances) => {
  return { type: SET_ACCOUNT_BALANCES, balances };
};

export const setLP = (lp) => {
  return { type: SET_LP, lp };
};
