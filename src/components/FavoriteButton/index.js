import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";

import { addToken, removeToken } from "actions/favorites";
import DiamondIcon from "assets/images/diamond-icon.png";

const FavoriteButton = ({ currency = {}, visible = true, ...props }) => {
  const tokens = useSelector((state) => state.favorites?.tokens) || [];
  const network = useSelector((state) => state.favorites?.network) || "bsc";
  const dispatch = useDispatch();
  const address = currency.address || currency.id;
  const active = tokens.findIndex((token) => address === token.address) !== -1;
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        if (active) {
          dispatch(
            removeToken({
              address,
            })
          );
        } else {
          dispatch(
            addToken({
              id: address,
              address: address,
              symbol: currency.symbol,
              name: currency.name,
              network,
            })
          );
        }
      }}
      className="favorite-button"
      {...props}
    >
      <img
        src={DiamondIcon}
        className={`favorite-icon ${active ? "active" : ""}`}
      />
    </IconButton>
  );
};

export default FavoriteButton;
