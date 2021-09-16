import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import Indicator from "components/Indicator";
import Paper from "components/Paper";
import { bnbAddress, ethAddress } from "constants/addresses";
import { QUOTE_PRICE } from "queries/history";

import init from "./init";
import initEther from "./initEther";

const percentages = [25, 50, 75, 100];

const Swap = ({ address, symbol, network: networkDefault }) => {
  let network = useSelector((state) => state.favorites?.network || "bsc");
  if (networkDefault) {
    network = networkDefault;
  }
  let accountAddress = useSelector((state) => state.account?.address);
  const [buyInputAmount, setBuyInputAmount] = useState(1);
  const [buyOutAmount, setBuyOutputAmount] = useState("");
  const [sellInputAmount, setSellInputAmount] = useState(1);
  const [sellOutAmount, setSellOutputAmount] = useState("");
  const mainAddress = network === "bsc" ? bnbAddress : ethAddress;
  const mainSymbol = network === "bsc" ? "BNB" : "ETH";
  const accountBalances = useSelector((state) => state.account?.balances);
  const { data, loading } = useQuery(QUOTE_PRICE, {
    variables: {
      from: address,
      to: mainAddress,
    },
    skip: !address,
  });

  let [quotePrice, decimals] = data?.quotePrice?.split(":") || [];
  useEffect(() => {
    if (quotePrice) {
      setBuyOutputAmount(1 / quotePrice);
      setSellOutputAmount(quotePrice);
    }
  }, [quotePrice]);

  const format18 = (number) =>
    number && `${number}`.indexOf("e-") !== -1
      ? Number(number).toFixed(18)
      : number;

  return (
    <Grid className="swap-container" container>
      <Grid item xs={12} sm={6}>
        <Paper color="dark">
          <div>
            <div className="info-wrapper">
              <Typography variant="h6">Buy</Typography>
              <Typography>
                Balance: {accountBalances[mainAddress] || "-"} {mainSymbol}
              </Typography>
            </div>
            <Indicator loading={loading} />
          </div>
          <TextField
            id="buy-from"
            label={`From ${mainSymbol}`}
            value={format18(buyInputAmount)}
            type="number"
            fullWidth
            className="text-field"
            onChange={({ target: { value } }) => {
              setBuyInputAmount(value);
              setBuyOutputAmount(value / quotePrice);
            }}
          />
          <ButtonGroup
            className="button-group"
            color="primary"
            aria-label="outlined primary button group"
          >
            {percentages.map((percentage) => (
              <Button
                key={percentage}
                onClick={() => {
                  setBuyInputAmount(
                    (accountBalances[mainAddress] * percentage) / 100
                  );
                  setBuyOutputAmount(
                    (accountBalances[mainAddress] * percentage) /
                      100 /
                      quotePrice
                  );
                }}
                disabled={!accountBalances[mainAddress]}
              >
                {percentage}%
              </Button>
            ))}
          </ButtonGroup>
          <TextField
            id="buy-to"
            label={`To ${symbol}`}
            value={format18(buyOutAmount)}
            type="number"
            fullWidth
            className="text-field"
            onChange={({ target: { value } }) => {
              setBuyInputAmount(value * quotePrice);
              setBuyOutputAmount(value);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={network !== "bsc"}
            onClick={() => {
              if (network === "bsc") {
                init({
                  buyCurrency: address,
                  sellCurrency: mainAddress,
                  buyAmount: buyOutAmount.toString(),
                  sellAmount: buyInputAmount.toString(),
                  sellDecimals: 18,
                  buyDecimals: decimals,
                  to: accountAddress,
                  network,
                });
              } else {
                initEther({
                  buyCurrency: address,
                  sellCurrency: mainAddress,
                  buyAmount: buyOutAmount.toString(),
                  sellAmount: buyInputAmount.toString(),
                  sellDecimals: 18,
                  buyDecimals: decimals,
                  to: accountAddress,
                  network,
                });
              }
            }}
          >
            Swap
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper color="dark">
          <div>
            <div className="info-wrapper">
              <Typography variant="h6">Sell</Typography>
              <Typography>
                Balance: {accountBalances[address] || "-"} {symbol}
              </Typography>
            </div>
            <Indicator loading={loading} />
          </div>
          <TextField
            id="sell-from"
            label={`From ${symbol}`}
            value={format18(sellInputAmount)}
            type="number"
            fullWidth
            className="text-field"
            onChange={({ target: { value } }) => {
              setSellInputAmount(value);
              setSellOutputAmount(value * quotePrice);
            }}
          />
          <ButtonGroup
            className="button-group"
            color="secondary"
            aria-label="outlined secondary button group"
          >
            {percentages.map((percentage) => (
              <Button
                key={percentage}
                onClick={() => {
                  setSellInputAmount(
                    (accountBalances[address] * percentage) / 100
                  );
                  setSellOutputAmount(
                    ((accountBalances[address] * percentage) / 100) * quotePrice
                  );
                }}
                disabled={!accountBalances[address]}
              >
                {percentage}%
              </Button>
            ))}
          </ButtonGroup>
          <TextField
            id="sell-to"
            label={`To ${mainSymbol}`}
            value={format18(sellOutAmount)}
            type="number"
            fullWidth
            onChange={({ target: { value } }) => {
              setSellInputAmount(value / quotePrice);
              setSellOutputAmount(value);
            }}
            className="text-field"
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            disabled={network !== "bsc"}
            onClick={() =>
              init({
                buyCurrency: mainAddress,
                sellCurrency: address,
                buyAmount: sellOutAmount.toString(),
                sellAmount: sellInputAmount.toString(),
                sellDecimals: decimals,
                buyDecimals: 18,
                to: accountAddress,
              })
            }
          >
            Swap
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Swap;
