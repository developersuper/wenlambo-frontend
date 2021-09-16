import React from "react";
import IconButton from "@material-ui/core/IconButton";

import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";

const WalletViewButton = ({ address, setWallet, disabled, ...props }) => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) return;
        setWallet({
          address,
          alias: `Wallet ${address.slice(0, 5)}...${address.slice(-4)}`,
        });
        window.scrollTo(0, 0);
      }}
      className="favorite-button"
      {...props}
    >
      <AccountBalanceWalletOutlinedIcon
        color="primary"
        className={`favorite-icon ${disabled ? "" : "active"}`}
      />
    </IconButton>
  );
};

export default WalletViewButton;
