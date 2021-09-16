import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import humanizeDuration from "humanize-duration";
import currencyFormatter from "currency-formatter";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { compact } from "lodash";

import PremiumButton from "components/PremiumButton";
import FavoriteWalletButton from "components/FavoriteWalletButton";
import WalletViewButton from "components/WalletViewButton";
import HelpButton from "components/HelpButton";
import Paper from "components/Paper";
import Indicator from "components/Indicator";
import TableWrapper from "components/TableWrapper";
import { TRADES } from "queries/history";

let interval = null;

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

const generateColumns = (
  symbol,
  qSymbol,
  currencySymbol,
  setWallet,
  hideWalletShow,
  showMyWallet,
  premium,
  network = "bsc"
) =>
  compact([
    {
      headerName: "",
      field: "side",
      render: ({ side }) =>
        side === "SELL" ? (
          <ArrowLeft style={{ color: "green" }} />
        ) : (
          <ArrowRight style={{ color: "red" }} />
        ),
    },
    {
      field: "amount",
      headerName: "Amount",
      headerStyle: { textAlign: "center" },
      render: ({ side, buyAmount, sellAmount }) => {
        const defaultSymbol = network === "bsc" ? "BNB" : "ETH";
        const quoteSymbol =
          qSymbol || (symbol === defaultSymbol ? "USD" : defaultSymbol);
        return (
          <div className="amount-item-wrapper">
            <div className="amount-item">
              <Typography variant="caption" display="block" className="amount">
                {currencyFormatter.format(buyAmount, {
                  locale: "en-US",
                  format: "%v",
                })}
              </Typography>
              <Typography variant="caption" display="block" className="symbol">
                {side === "BUY" ? symbol : quoteSymbol}
              </Typography>
            </div>
            <div className="amount-item">
              <Typography variant="caption" display="block" className="amount">
                {currencyFormatter.format(sellAmount, {
                  locale: "en-US",
                  format: "%v",
                })}
              </Typography>
              <Typography variant="caption" display="block" className="symbol">
                {side === "BUY" ? quoteSymbol : symbol}
              </Typography>
            </div>
          </div>
        );
      },
    },
    {
      field: "amountInUSD",
      headerName: "Value",
      render: ({ amountInUSD, side, buyAmount, sellAmount }) => (
        <Typography variant="caption" display="block">
          {currencyFormatter.format(
            symbol === "BNB"
              ? side === "BUY"
                ? sellAmount
                : buyAmount
              : amountInUSD,
            {
              locale: "en-US",
              format: `${currencySymbol}%v`,
            }
          )}{" "}
        </Typography>
      ),
    },
    !showMyWallet && {
      field: "taker",
      headerName: "Wallet",
      headerStyle: { textAlign: "center" },
      render: ({ taker, count, amount }) => (
        <div className="wallet-cell">
          {premium &&
            (count >= 1000 ? (
              <HelpButton icon={"🤖"}>
                Trader with 1000+ TXs in the last 30 days. Most likely a bot.
              </HelpButton>
            ) : amount >= 5000000 ? (
              <HelpButton icon={"🐳"}>
                Heavy Trader with $500k+ of a trading volume in the last 30 days
              </HelpButton>
            ) : amount >= 100000 ? (
              <HelpButton icon={"🦈"}>
                Active Trader with $100k-$500k of a trading volume in the last
                30 days
              </HelpButton>
            ) : amount >= 10000 ? (
              <HelpButton icon={"🐢"}>
                Casual Trader with $10k-$100k of a trading volume in the last 30
                days
              </HelpButton>
            ) : null)}
          <FavoriteWalletButton address={taker} />
          {!hideWalletShow && (
            <WalletViewButton setWallet={setWallet} address={taker} />
          )}
        </div>
      ),
    },
    {
      field: "time",
      headerName: "Time",
      render: ({ time }) => (
        <Typography variant="caption" display="block">
          {shortEnglishHumanizer(
            new Date(`${time}:000Z`).getTime() - new Date().getTime(),
            { largest: 1, round: true, spacer: "" }
          )}
          {" ago"}
        </Typography>
      ),
    },
  ]);

const TradeHistory = ({
  symbol,
  address,
  quoteSymbol,
  quoteAddress,
  hideTitle,
  currencySymbol,
  setWallet,
  hideWalletShow,
  wallet,
  network = "bsc",
}) => {
  const premium = useSelector((state) => state.account?.lp?.premium);
  const limit = premium ? 50 : 5;
  const [showMyWallet, setShowMyWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [getTrades] = useLazyQuery(TRADES, {
    fetchPolicy: "network-only",
    variables: {
      address,
      quoteAddress,
      currency: currencySymbol,
      wallet: showMyWallet ? wallet?.address : undefined,
      limit,
    },
    onCompleted: (data) => {
      setLoading(false);
      setData(data);
      console.log('>>get treads???>>', data);
    },
    onError: (error) => {
      setLoading(false);
    },
  });
  const columns = generateColumns(
    symbol,
    quoteSymbol,
    currencySymbol,
    setWallet,
    hideWalletShow,
    showMyWallet,
    premium,
    network
  );

  useEffect(() => {
    if (!address && !quoteAddress) {
      return;
    }
    setLoading(true);
    console.log('getTreades>>>>', address, quoteAddress, currencySymbol, showMyWallet ? wallet?.address : undefined, limit,);
    getTrades();
    interval = setInterval(() => {
      getTrades();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Paper color="dark" className="trade-history">
      {!hideTitle && (
        <div className="trade-history-header">
          <div className="row-align">
            {!premium && <PremiumButton />}
            <ToggleButtonGroup
              value={showMyWallet}
              exclusive
              onChange={(e, value) => {
                setLoading(true);
                setShowMyWallet(value);
              }}
              aria-label="text alignment"
              size="small"
            >
              <ToggleButton
                className="toggle-button"
                value={false}
                aria-label="all"
              >
                Token Tx
              </ToggleButton>
              <ToggleButton
                className="toggle-button"
                value={true}
                aria-label="my wallet"
              >
                Wallet Tx
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Typography variant="h6" className="title" component="h6">
            Trade History
          </Typography>
        </div>
      )}
      <Indicator loading={loading} />
      <TableWrapper>
        <Table
          stickyHeader
          size="small"
          aria-label="a dense table"
          className="trade-history-table"
        >
          <TableHead>
            <TableRow>
              {columns.map(({ field, headerName, headerStyle }) => (
                <TableCell key={field} style={headerStyle}>
                  {headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(loading ? [] : data?.trades)?.map((row) => (
              <TableRow
                key={row.txHash}
                className="data-row"
                onClick={() => {
                  window.open(`https://bscscan.com/tx/${row.txHash}`, "_blank");
                }}
              >
                {columns.map(({ field, render }) => (
                  <TableCell key={field} style={{ lineHeight: 1 }}>
                    {render ? render(row) : row[field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </Paper>
  );
};

export default TradeHistory;
