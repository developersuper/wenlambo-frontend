import { combineReducers } from "redux";

import account from "./account";
import favorites from "./favorites";

export default combineReducers({
  account,
  favorites,
});
