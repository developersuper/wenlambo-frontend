import React, { useState, useEffect } from "react";
import Web3 from "web3";
import WalletConnect from "walletconnect";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import mobile from "is-mobile";

import { setAccountAddress } from "actions/account";

const ConnectButton = ({ hide }) => {
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const dispatch = useDispatch();
  const connectMeta = async () => {
    const isPhone = mobile();
    try {
      let accounts = [];
      if (isPhone) {
        const wc = new WalletConnect();
        const connector = await wc.connect();
        accounts = connector.accounts;
      } else {
        await window.ethereum.enable();
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
        const web3 = new Web3(window.ethereum);
        accounts = await web3.eth.getAccounts();
      }
      setConnected(accounts.length > 0);
      setAccounts(accounts);
      setConnected(true);
      dispatch(setAccountAddress(accounts[0]));
      localStorage.setItem("loggedin", isPhone ? "phone" : "desktop");
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  const disconnectMeta = async () => {
    try {
      if (localStorage.getItem("loggedin") === "phone") {
        const wc = new WalletConnect();
        const connector = await wc.connect();
        connector.killSession();
      }
      setConnected(false);
      setAccounts([]);
      dispatch(setAccountAddress(undefined));
      localStorage.setItem("loggedin", false);
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const connectAccount = async () => {
      if (
        typeof window.ethereum !== "undefined" &&
        localStorage.getItem("loggedin") === "desktop"
      ) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setConnected(accounts.length > 0);
        setAccounts(accounts);
        dispatch(setAccountAddress(accounts[0]));
      } else if (
        typeof window.ethereum !== "undefined" &&
        localStorage.getItem("loggedin") === "phone"
      ) {
        try {
          const wc = new WalletConnect();
          const connector = await wc.connect();
          setConnected(connector.accounts.length > 0);
          setAccounts(connector.accounts);
          dispatch(setAccountAddress(connector.accounts[0]));
        } catch (e) {
          console.log(e);
        }
      }
    };
    connectAccount();
  }, [connected]);

  if (hide) return null;

  return (
    <>
      {connected ? (
        <Button
          color="primary"
          variant="contained"
          style={{ marginRight: 8 }}
          onClick={disconnectMeta}
          className="button-normal"
        >
          Disconnect Wallet
        </Button>
      ) : (
        <Button
          className="connect-button"
          color="primary"
          variant="contained"
          onClick={connectMeta}
          className="button-normal"
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default ConnectButton;
