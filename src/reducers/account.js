import {
  SET_ACCOUNT_ADDRESS,
  SET_ACCOUNT_BALANCES,
  SET_LP,
} from "constants/actionTypes";

const initialState = {
  address: null,
  balances: {},
  lp: { usdValue: 0, percentage: 0, lpHolding: 0, premium: false },
};

const account = (state = initialState, action) => {
  let newState = state;
  switch (action.type) {
    case SET_ACCOUNT_ADDRESS:
      newState = {
        ...state,
        address: action.address,
      };
      return newState;
    case SET_ACCOUNT_BALANCES:
      newState = {
        ...state,
        balances: action.balances,
      };
      return newState;
    case SET_LP:
      newState = {
        ...state,
        lp: action.lp,
      };
      return newState;
    default:
      return newState;
  }
};

export default account;
