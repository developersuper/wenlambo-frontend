import React from "react";
import currencyFormatter from "currency-formatter";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import TableWrapper from "components/TableWrapper";
import FavoriteButton from "components/FavoriteButton";
import ShowButton from "components/ShowButton";

const BalanceTable = ({
  balances,
  currency,
  setCurrency,
  symbol: currencySymbol,
  blackList,
  setBlackList,
  network,
}) => {
  const columns = [
    {
      field: "favorite",
      headerName: "",
      render: (row) =>
        blackList.includes(row.id || row.address) ? (
          ""
        ) : (
          <FavoriteButton currency={row} />
        ),
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "holdings",
      headerName: "Holdings",
      render: ({ holdings }) =>
        currencyFormatter.format(Number(holdings).toFixed(2), {
          locale: "en-US",
          format: "%v",
        }),
    },
    {
      field: "value",
      headerName: "Value",
      render: ({ value, bnbValue }) => (
        <div>
          {currencyFormatter.format(value, {
            locale: "en-US",
            format: `${currencySymbol}%v`,
          })}
          <br />
          <Typography
            variant="caption"
            display="block"
            style={{ lineHeight: 1.2, marginTop: 2 }}
          >
            {currencyFormatter.format(bnbValue, {
              locale: "en-US",
              format: "%v",
            })}
            {network.toUpperCase()}
          </Typography>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      render: ({ price }) =>
        currencyFormatter.format(price, {
          locale: "en-US",
          format: `${currencySymbol}%v`,
          precision: (`${price}`.split(".")[1] || "0").length,
        }),
    },
    {
      field: "show",
      headerName: "",
      render: (row) => (
        <ShowButton
          currency={row}
          blackList={blackList}
          setBlackList={setBlackList}
        />
      ),
    },
  ];

  return (
    <TableWrapper>
      <Table
        stickyHeader
        size="small"
        aria-label="a dense table"
        className="balance-table"
      >
        <TableHead>
          <TableRow>
            {columns.map(({ field, headerName }) => (
              <TableCell key={field}>{headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {balances.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => setCurrency(row)}
              className={`data-row ${currency.id === row.id ? "active" : ""}`}
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
  );
};

export default BalanceTable;
