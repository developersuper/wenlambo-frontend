import React from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import currencyFormatter from "currency-formatter";
import { useQuery } from "@apollo/react-hooks";

import FavoriteButton from "components/FavoriteButton";
import Paper from "components/Paper";
import Indicator from "components/Indicator";
import { TOKEN_INFO } from "queries/history";

const TokenInfo = ({
  currency = {},
  bnbPrice,
  symbol: currencySymbol = "$",
}) => {
  const network = useSelector((state) => state.favorites?.network || "bsc");
  const { address, name, symbol } = currency;
  const { data, loading } = useQuery(TOKEN_INFO, {
    variables: {
      address,
      currency: currencySymbol,
    },
    skip: !address,
  });
  const info = loading ? {} : data?.tokenInfo;
  const scanUrl =
    network === "bsc" ? "https://bscscan.com" : "https://etherscan.io";
  return (
    <Paper color="dark" className="token-info">
      <div>
        <div className="title-wrapper">
          <Typography variant="h6" className="title">
            Token Info
          </Typography>
          <FavoriteButton currency={currency} />
        </div>
        <Indicator loading={loading} />
      </div>
      <div className={`info ${loading ? "loading" : ""}`}>
        <Typography>
          <span className="subheading">Name</span>
          {name} ({symbol})
        </Typography>
        <Typography>
          <span className="subheading">Price</span>
          {currencyFormatter.format(info?.price || 0, {
            locale: "en-US",
            format: `${currencySymbol}%v`,
            precision: (`${info?.price}`.split(".")[1] || "0").length,
          })}
        </Typography>
        <Typography>
          <span className="subheading">Total Supply</span>
          {currencyFormatter.format(info?.totalSupply || 0, {
            locale: "en-US",
            format: "%v",
          })}
        </Typography>
        <Typography>
          <span className="subheading">Market Cap</span>
          {currencyFormatter.format(info?.marketCap || 0, {
            locale: "en-US",
            format: `${currencySymbol}%v`,
          })}
        </Typography>
        <Typography>
          <span className="subheading">Total tx</span>
          {currencyFormatter.format(info?.transfers || 0, {
            locale: "en-US",
            format: "%v",
            precision: 0,
          })}
        </Typography>
        <Typography>
          <span className="subheading">Liquidity</span>
          {currencyFormatter.format(info?.totalLiquidityBNB || 0, {
            locale: "en-US",
            format: "%v",
          })}{" "}
          {network.toUpperCase()} (
          {currencyFormatter.format((info?.totalLiquidityBNB || 0) * bnbPrice, {
            locale: "en-US",
            format: `${currencySymbol}%v`,
          })}
          )
        </Typography>
      </div>
      <Grid container className={`buttons ${loading ? "loading" : ""}`}>
        <Grid item xs={12}>
          <a href={`${scanUrl}/token/${address}`} target="_blank">
            <Button className="button-normal" fullWidth>
              Transactions
            </Button>
          </a>
        </Grid>
        <Grid item xs={12} md={6}>
          <a href={`${scanUrl}/address/${address}#code`} target="_blank">
            <Button className="button-normal" fullWidth>
              Contract
            </Button>
          </a>
        </Grid>
        <Grid item xs={12} md={6}>
          <a href={`${scanUrl}/token/${address}#balances`} target="_blank">
            <Button className="button-normal" fullWidth>
              Holders
            </Button>
          </a>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TokenInfo;
