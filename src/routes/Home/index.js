import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import queryString from "query-string";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import Hidden from "@material-ui/core/Hidden";

import { setNetwork } from "actions/favorites";
import ConnectButton from "components/ConnectButton";
import Paper from "components/Paper";
import Swap from "components/Swap";
import TopAds from "components/TopAds";
import TradingView from "components/TradingView";
import TradeHistory from "components/TradeHistory";
import { SEARCH_TOKEN } from "queries/history";
import { BNB_PRICE } from "queries/tools";

import Portfolio from "./components/Portfolio";
import TokenInfo from "./components/TokenInfo";
import TrendingTokens from "./components/TrendingTokens";

const symbols = {
  usd: "$",
  gbp: "£",
  aud: "A$",
  eur: "€",
  jpy: "¥",
  zar: "R",
};

let bnbTimeInterval = null;

const Home = ({ location }) => {
  console.log('-------------->',location)
  const history = useHistory();
  const dispatch = useDispatch();
  let accountAddress = useSelector((state) => state.account?.address);
  const network = useSelector((state) => state.favorites?.network);
  const premium = useSelector((state) => state.account?.lp?.premium);
  const [globalCurrency, setGlobalCurrency] = useState("usd");
  const [bnbUsdPrice, setbnbUsdPrice] = useState();
  const [wallet, setWallet] = useState({});
  const [searchToken, { data: currencyData, loading: currencyLoading }] =
    useLazyQuery(SEARCH_TOKEN);
  const { token } = queryString.parse(location.search);
  const [currency, setCurrencyOriginal] = useState({});
  const setCurrency = (currency) => {
    const address = currency.id || currency.address;
    if (token !== address) {
      history.push(`/?token=${address}`);
    }
  };
  const [getBnbPrice] = useLazyQuery(BNB_PRICE, {
    fetchPolicy: "network-only",
    variables: {
      currency: globalCurrency,
    },
    onCompleted: ({ bnbPrice }) => {
      setbnbUsdPrice(bnbPrice);
    },
  });
  useEffect(() => {
    setWallet({ address: accountAddress, alias: "My Wallet" });
  }, [accountAddress]);
  useEffect(() => {
    if (bnbTimeInterval) {
      clearInterval(bnbTimeInterval);
    }
    getBnbPrice();
    bnbTimeInterval = setInterval(() => {
      getBnbPrice();
    }, 5000);
  }, [globalCurrency]);
  useEffect(() => {
    if (token) {
      searchToken({ variables: { address: token } });
    } else if (network === "eth") {
      setCurrencyOriginal({
        symbol: "ETH",
        name: "Ether",
        id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      });
    } else {
      setCurrencyOriginal({
        symbol: "(LAMBO)",
        name: "WEN LAMBO",
        id: "0x2c7b396d17e3a5184d4901380836de7a72c5cba4",
        address: "0x2c7b396d17e3a5184d4901380836de7a72c5cba4",
      });
    }
  }, [token]);
  useEffect(() => {
    if (
      currencyData?.searchToken?.address &&
      currencyData?.searchToken?.address !== (currency?.id || currency?.address)
    ) {
      const newCurrency = {
        ...currencyData?.searchToken,
        id: currencyData?.searchToken?.address,
      };
      if (newCurrency.symbol === "BNB") {
        setCurrencyOriginal({
          ...newCurrency,
          id: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        });
      } else {
        setCurrencyOriginal(newCurrency);
      }
    } else if (currencyData?.searchToken === null) {
      history.push("/");
    }
  }, [currencyData]);
  const leftSize = 8;
  const rightSize = 12 - 8;
  const announcement = (
    <span>
      Premium Access is now available! Hold $150{" "}
      <a
        href="https://exchange.pancakeswap.finance/#/add/BNB/0x2c7b396d17e3a5184d4901380836de7a72c5cba4"
        target="_blank"
      >
        LAMBO-BNB LP
      </a>{" "}
      to access. Find out more by clicking here:{" "}
      <Link to="/premium">Premium Access</Link>
    </span>
  );
  return (
    <>
      <Grid
        className={`home ${currencyLoading ? "loading" : ""}`}
        container
        spacing={1}
      >
        <Grid item className="home-section tiny logo-container">
          <TopAds />
        </Grid>
        <Grid item className="home-section tiny connect-container">
          <div className="connect-wrapper">
            <Select
              native
              value={network}
              inputProps={{
                name: "network",
              }}
              className="dropdown"
              style={{ width: 55, marginRight: 5 }}
              onChange={({ target: { value } }) => {
                dispatch(setNetwork(value));
                // history.push("/");
                window.location.href = "/";
              }}
            >
              <option value="bsc">BSC</option>
              <option value="eth">ETH</option>
            </Select>
            <Select
              native
              value={globalCurrency}
              inputProps={{
                name: "currency",
              }}
              className="dropdown"
              style={{ width: 55 }}
              onChange={({ target: { value } }) => {
                if (value === "premium") {
                  history.push("/premium");
                } else {
                  setGlobalCurrency(value);
                }
              }}
            >
              <option value="usd">USD</option>
              {premium && (
                <>
                  <option value="gbp">GBP</option>
                  <option value="aud">AUD</option>
                  <option value="eur">EUR</option>
                  <option value="jpy">JPY</option>
                  <option value="zar">ZAR</option>
                </>
              )}
              {!premium && (
                <option value="premium">
                  Upgarde to Premium to view other currencies
                </option>
              )}
            </Select>
            <ConnectButton />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Box className="announcement-bar">
            <span className="bnb-price">
              {network === "bsc" ? "BNB" : "ETH"}: {symbols[globalCurrency]}
              {bnbUsdPrice?.toFixed(3)}
            </span>
            <div className="announcement-wrapper">
              <div className="announcement">
                {announcement}
                {announcement}
                {announcement}
              </div>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12} className="content">
          <Grid container>
            <Grid item xs={12} md={leftSize} className="home-section big">
              <Paper expandable color="dark" className="portfolio-section">
                <Portfolio
                  setCurrency={setCurrency}
                  currency={currency}
                  symbol={symbols[globalCurrency]}
                  wallet={wallet}
                  setWallet={setWallet}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={rightSize} className="home-section big">
              <Hidden smDown>
                <Paper
                  expandable
                  color="dark"
                  className="trending-tokens-section"
                >
                  <TrendingTokens
                    setCurrency={setCurrency}
                    currency={currency}
                    symbol={symbols[globalCurrency]}
                  />
                </Paper>
              </Hidden>
              <Hidden mdUp>
                <Paper color="dark">
                  <TokenInfo
                    currency={currency}
                    bnbPrice={bnbUsdPrice}
                    symbol={symbols[globalCurrency]}
                  />
                </Paper>
              </Hidden>
            </Grid>
            <Grid item xs={12} md={leftSize} className="home-section big">
              <Paper expandable color="dark" className="tradingview-section">
                {currency.address && (
                  <>
                    <Hidden smDown>
                      <TradingView
                        key={globalCurrency}
                        symbol={currency.symbol}
                        address={currency.id}
                        disableFeatures={["header_compare", "header_undo_redo"]}
                        currencySymbol={symbols[globalCurrency]}
                        compareSymbol={globalCurrency.toUpperCase()}
                        network={network}
                      />
                    </Hidden>
                    <Hidden mdUp>
                      <TradingView
                        key={globalCurrency}
                        symbol={currency.symbol}
                        address={currency.id}
                        disableFeatures={[
                          "left_toolbar",
                          "header_compare",
                          "header_undo_redo",
                        ]}
                        currencySymbol={symbols[globalCurrency]}
                        compareSymbol={globalCurrency.toUpperCase()}
                        network={network}
                      />
                    </Hidden>
                  </>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={rightSize} className="home-section big">
              <Hidden smDown>
                <Paper color="dark">
                  <TokenInfo
                    currency={currency}
                    bnbPrice={bnbUsdPrice}
                    symbol={symbols[globalCurrency]}
                  />
                </Paper>
              </Hidden>
              <Hidden mdUp>
                <Paper expandable color="dark" className="tradehistory-section">
                  <TradeHistory
                    key={currency.id}
                    symbol={currency.symbol}
                    address={currency.id}
                    currencySymbol={symbols[globalCurrency]}
                    setWallet={setWallet}
                    wallet={wallet}
                    network={network}
                  />
                </Paper>
              </Hidden>
            </Grid>
            <Grid item xs={12} md={leftSize} className="home-section">
              <Paper color="dark" className="swap-section">
                <Swap
                  symbol={currency.symbol}
                  address={currency.id}
                  network={network}
                />
              </Paper>
            </Grid>
            <Hidden smDown>
              <Grid item xs={12} md={rightSize} className="home-section">
                <Paper expandable color="dark" className="tradehistory-section">
                  <TradeHistory
                    key={currency.id}
                    symbol={currency.symbol}
                    address={currency.id}
                    currencySymbol={symbols[globalCurrency]}
                    setWallet={setWallet}
                    wallet={wallet}
                    network={network}
                  />
                </Paper>
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
