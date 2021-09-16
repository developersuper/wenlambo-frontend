import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";

import { addWallet, removeWallet } from "actions/favorites";
import DiamondIcon from "assets/images/diamond-icon.png";
import PremiumLink from "components/PremiumLink";

const FavoriteWalletButton = ({ address, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const wallets = useSelector((state) => state.favorites?.wallets) || [];
  const lp = useSelector((state) => state.account?.lp);
  const limit = lp?.premium ? 50 : 2;
  const dispatch = useDispatch();
  const active =
    wallets.findIndex((wallet) => address === wallet.address) !== -1;

  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        if (e.target.tagName.toLowerCase() !== "img") {
          return;
        }
        if (active) {
          dispatch(
            removeWallet({
              address,
            })
          );
        } else if (wallets?.length >= limit) {
          setAnchorEl(e.currentTarget);
          setOpen(true);
        } else {
          dispatch(
            addWallet({
              address,
              alias: `Wallet ${address.slice(0, 5)}...${address.slice(-4)}`,
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
      <Popover
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="help-button-popover">
          {lp?.premium ? (
            "Save up to 50 wallets only."
          ) : (
            <>
              <PremiumLink /> to add more.
            </>
          )}
        </div>
      </Popover>
    </IconButton>
  );
};

export default FavoriteWalletButton;
