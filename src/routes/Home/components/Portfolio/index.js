import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import { sumBy } from "lodash";

import { setAccountBalances } from "actions/account";
import { updateBlackList } from "actions/favorites";
import WalletIcon from "assets/images/wallet-icon.png";
import HelpButton from "components/HelpButton";
import Indicator from "components/Indicator";
import Paper from "components/Paper";
import PremiumButton from "components/PremiumButton";
import { BALANCES } from "queries/balance";

import BalanceTable from "./BalanceTable";
import PortfolioDonutChart from "./PortfolioDonutChart";
import OtherWallet from "./Modals/OtherWallet";
import SearchToken from "./Modals/SearchToken";
import Wallets from "./Modals/Wallets";
import Tokens from "./Modals/Tokens";

const Portfolio = ({ setCurrency, currency, symbol, wallet, setWallet }) => {
  const premium = useSelector((state) => state.account?.lp?.premium);
  const wallets = useSelector((state) => state.favorites?.wallets) || [];
  const blackList = useSelector((state) => state.favorites?.blackList || []);
  const network = useSelector((state) => state.favorites?.network || "bsc");
  let accountAddress = useSelector((state) => state.account?.address);
  const [showBlackList, setShowBlackList] = useState(false);
  const { address, alias } = wallet;
  const dispatch = useDispatch();
  const { data, loading } = useQuery(BALANCES, {
    variables: { walletAddress: address, currency: symbol },
    skip: !address,
    onCompleted: (data) => {
      if (address === accountAddress && data) {
        const balances = {};
        data.balances.forEach(({ value, currency: { address } }) => {
          balances[address] = value;
        });
        dispatch(setAccountBalances(balances));
      }
    },
    onError: (data) => {
      console.log(data);
    },
  });
  const setBlackList = (blackList) => {
    dispatch(updateBlackList(blackList));
  };
  const balancesUnfiltered =
    data?.balances?.map(({ value, currency, bnbValue }) => ({
      id: currency.address,
      name: currency.name,
      symbol: currency.symbol,
      holdings: value.toFixed(2),
      price: currency.price || 0,
      value: value * (currency.price || 0),
      bnbValue,
    })) || [];
  const filteredBalances = loading
    ? []
    : balancesUnfiltered.filter((item) =>
        showBlackList
          ? blackList.includes(item.id || item.address)
          : !blackList.includes(item.id || item.address)
      );
  return (
    <Grid className="portfolio" container>
      <Grid item xs={12} lg={12} className="upper">
        <Grid container className="space-between row-align">
          <Grid item>
            <div className="row-align space-between">
              <Typography variant="h5" className="title" component="h6">
                Portfolio
              </Typography>
              <HelpButton
                icon={<AccountBalanceWalletOutlinedIcon color="primary" />}
                hover
                className="wallet-address"
                popoverProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
              >
                <Typography variant="caption">{address}</Typography>
              </HelpButton>
            </div>
          </Grid>
          <Grid item className="row-align">
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                setWallet({ address: accountAddress, alias: "My Wallet" })
              }
            >
              <img src={WalletIcon} className="button-icon" />
              My Wallet
            </Button>
            <OtherWallet
              setAddress={(address) =>
                setWallet(
                  wallets.find((wallet) => wallet.address === address) || {
                    address,
                    alias: "Other Wallet",
                  }
                )
              }
            />
            <SearchToken setCurrency={setCurrency} />
            <Wallets setWallet={setWallet} address={wallet.address} />
            <Tokens
              setToken={setCurrency}
              address={currency.id || currency.address}
            />
            {!premium && (
              <PremiumButton
                popoverProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Indicator loading={loading} />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={showBlackList}
              onChange={() => setShowBlackList(!showBlackList)}
              name="black-list"
              color="primary"
            />
          }
          label="Show blacklist"
          style={{ marginTop: 10 }}
        />
      </Grid>
      {!showBlackList && (
        <Grid item xs={12} lg={4} className="bottom">
          <Paper color="dark" loading={loading}>
            <PortfolioDonutChart
              balances={filteredBalances}
              setCurrency={setCurrency}
              currency={currency}
              sum={sumBy(filteredBalances, ({ value }) => Number(value))}
              symbol={symbol}
            />
          </Paper>
        </Grid>
      )}
      <Grid item xs={12} lg={showBlackList ? 12 : 8} className="bottom">
        <Paper color="dark" loading={loading}>
          <BalanceTable
            balances={filteredBalances}
            setCurrency={setCurrency}
            currency={currency}
            symbol={symbol}
            blackList={blackList}
            setBlackList={setBlackList}
            showBlackList={showBlackList}
            network={network}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Portfolio;
