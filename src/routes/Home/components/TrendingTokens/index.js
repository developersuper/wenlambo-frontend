import React from "react";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import currencyFormatter from "currency-formatter";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Indicator from "components/Indicator";
import Paper from "components/Paper";
import TableWrapper from "components/TableWrapper";
import FavoriteButton from "components/FavoriteButton";
import { TRENDS } from "queries/history";

const TrendingTokens = ({ currency, setCurrency, symbol: currencySymbol }) => {
  const { data, loading } = useQuery(TRENDS, {
    variables: {
      since: moment().add(-1, "months").format("YYYY-MM-DD"),
      currency: currencySymbol,
    },
  });
  const columns = [
    {
      field: "favorite",
      headerName: "",
      render: (row) => <FavoriteButton currency={row} />,
    },
    {
      headerName: "Name",
      field: "name",
      render: ({ name, symbol }) => (
        <>
          <Typography variant="caption" display="block">
            {name}
          </Typography>
          <Typography variant="caption" display="block" className="symbol">
            {symbol}
          </Typography>
        </>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      render: ({ price }) => (
        <Typography variant="caption" display="block">
          {currencyFormatter.format(price, {
            locale: "en-US",
            format: `${currencySymbol}%v`,
            precision: (`${price}`.split(".")[1] || "0").length,
          })}
        </Typography>
      ),
    },
  ];

  return (
    <Paper color="dark" className="trending-tokens">
      <Typography variant="h6" className="title">
        Trending Tokens
      </Typography>
      <Indicator loading={loading} />
      <TableWrapper>
        <Table
          stickyHeader
          size="small"
          aria-label="a dense table"
          className="trending-tokens-table"
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
            {(loading ? [] : data?.trends)?.map((row) => (
              <TableRow
                key={row.address}
                onClick={() => setCurrency({ ...row, id: row.address })}
                className={`data-row ${
                  currency.address === row.address ? "active" : ""
                }`}
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

export default TrendingTokens;
