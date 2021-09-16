import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import currencyFormatter from "currency-formatter";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

import HelpButton from "components/HelpButton";
import PremiumButton from "components/PremiumButton";
import Indicator from "components/Indicator";
import PremiumRequireModal from "components/PremiumRequireModal";
import SymbolFinder from "components/SymbolFinder";
import TableWrapper from "components/TableWrapper";
import { DEV_ACTIVITIES } from "queries/tools";
import { TOKEN_INFO } from "queries/history";

const RugChecker = () => {
  const premium = useSelector((state) => state.account?.lp?.premium);
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const { data, loading } = useQuery(DEV_ACTIVITIES, {
    skip: !token?.address,
    variables: {
      token: token?.address,
    },
  });
  const { data: info, loading: infoLoading } = useQuery(TOKEN_INFO, {
    skip: !token?.address,
    variables: {
      address: token?.address,
    },
  });
  const totalSupply = info?.tokenInfo?.totalSupply || 0;
  let filtered = (loading ? [] : data?.devActivities)?.filter(
    ({ contractType, currency: { symbol } }) => {
      if (["BNB", "Cake-LP", token?.symbol].indexOf(symbol) === -1) {
        return false;
      }
      return true;
    }
  );
  /* filtered = filtered?.slice(
    0,
    filtered.findIndex(({ contractType }) => contractType === "DEX") - 1
  ); */
  const columns = [
    {
      field: "date",
      headerName: "Date",
      render: ({ time }) => (
        <>
          <div>{moment(time).format("YYYY-MM-DD")}</div>
          {moment(time).format("hh:mm:ss A")}
        </>
      ),
    },
    {
      field: "token",
      headerName: "Token",
      render: ({ currency: { symbol } }) => symbol,
    },
    {
      field: "amount",
      headerName: "Amount",
      render: ({ amount, currency }) => {
        return (
          <>
            <div>
              {currencyFormatter.format(amount, {
                locale: "en-US",
                format: "%v",
              })}
            </div>
            <Typography variant="caption" color="textSecondary">
              {Boolean(totalSupply) &&
                currency?.address === token?.address &&
                `${((amount * 100) / totalSupply).toFixed(4)}%`}
            </Typography>
          </>
        );
      },
    },
    {
      field: "receiver",
      headerName: "Receiver",
      render: ({ address }) => address,
    },
    {
      field: "action",
      headerName: "Action",
      render: ({ address, contractType, currency, amount }) => {
        if (
          address === "0x0000000000000000000000000000000000000000" ||
          address === "0x000000000000000000000000000000000000dead"
        ) {
          return "Send to burn";
        } else if (!contractType) {
          return "Send to wallet";
        } else if (contractType === "Generic") {
          if (currency.symbol === "BNB") {
            return `Buy ${token?.symbol}`;
          } else {
            return "Send to contract";
          }
        } else if (contractType === "DEX") {
          if (currency.symbol === "Cake-LP") {
            return "Remove LP";
          } else if (
            currency.symbol === token?.symbol &&
            amount < totalSupply
          ) {
            return `Sell ${token?.symbol}`;
          }
          return "Create LP";
        }
        return "";
      },
    },
  ];
  return (
    <div className="rug-checker">
      <div className="rug-checker-header">
        <Typography variant="h6" className="title" component="h6">
          Rug Checker
        </Typography>
        <div className="row-align">
          {!premium && <PremiumButton full={false} />}
          <HelpButton>
            <Typography variant="body1">
              The Rug Checker pull’s up the developers wallet to see their
              transaction history. If they are splitting tokens into various
              other wallets, this is considered a red flag.
            </Typography>
          </HelpButton>
        </div>
      </div>
      <Indicator loading={loading || infoLoading} />
      <div className="symbol-finder">
        <SymbolFinder
          setCurrency={(token) => {
            if (!premium) {
              setOpen(true);
            } else {
              setToken(token);
            }
          }}
          currency={token}
          title="Enter token name / address..."
        />
      </div>
      <PremiumRequireModal open={open} setOpen={setOpen} />
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
            {filtered?.map((row, index) => (
              <TableRow key={index} className="data-row">
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
    </div>
  );
};

export default RugChecker;
