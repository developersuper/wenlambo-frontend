import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import currencyFormatter from "currency-formatter";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowUp from "@material-ui/icons/ArrowDropUp";
import ArrowDown from "@material-ui/icons/ArrowDropDown";

import HelpButton from "components/HelpButton";
import PremiumButton from "components/PremiumButton";
import Indicator from "components/Indicator";
import TableWrapper from "components/TableWrapper";
import FavoriteButton from "components/FavoriteButton";
import { TOP_GAINERS } from "queries/tools";
import openNewLink from "utils/openNewLink";

const timeframes = [
  {
    title: "5m",
    value: 5,
  },
  {
    title: "10m",
    value: 10,
  },
  {
    title: "30m",
    value: 30,
  },
  {
    title: "1h",
    value: 60,
  },
  {
    title: "5h",
    value: 300,
  },
  {
    title: "24h",
    value: 60 * 24,
  },
  {
    title: "7d",
    value: 60 * 24 * 7,
  },
  {
    title: "30d",
    value: 60 * 24 * 30,
  },
];

const TopGainers = ({ isLoser }) => {
  const history = useHistory();
  const premium = useSelector((state) => state.account?.lp?.premium);
  const [timeframe, setTimeframe] = useState(30);
  const { data, loading } = useQuery(TOP_GAINERS, {
    variables: {
      minutes: timeframe,
      isLoser,
      limit: premium ? 30 : 5,
    },
  });
  const currentTimeframe = timeframes.find(({ value }) => value === timeframe);
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
        <span className="name-wrapper">
          <Typography className="name">{name}</Typography>
          <Typography className="symbol">{symbol}</Typography>
        </span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      render: ({ price }) => {
        const [former, later] = `${price}`.split("e-");
        const decimal = `${former}`.split(".")[1] || "0";
        let precision =
          (later || 0) > 0
            ? Number(later) + 1
            : decimal.length - `${parseInt(decimal, 10)}`.length + 2;
        if (price > 1) {
          precision = 2;
        }
        return currencyFormatter.format(price, {
          locale: "en-US",
          precision,
        });
      },
    },
    {
      field: "",
      headerName: currentTimeframe?.title,
      render: ({ increase }) => (
        <span
          className={`${increase > 0 ? "increase" : "decrease"} percentage`}
        >
          {increase > 0 ? <ArrowUp /> : <ArrowDown />}
          {currencyFormatter.format(increase, {
            locale: "en-US",
            format: "%v%",
          })}
        </span>
      ),
    },
    {
      field: "increase",
      headerName: `Volume(${currentTimeframe?.title})`,
      render: ({ volume }) =>
        currencyFormatter.format(volume, {
          locale: "en-US",
        }),
    },
  ];
  console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]', data);
  return (
    <div className="top-gainers">
      <div className="top-gainers-header">
        <Typography variant="h6" className="title" component="h6">
          Top {isLoser ? "Losers" : "Gainers"}
        </Typography>
        <div className="dropdown-wrapper">
          {!premium && <PremiumButton />}
          <Select
            native
            value={timeframe}
            inputProps={{
              name: "timeframe",
            }}
            className="dropdown"
            style={{ width: 55 }}
            onChange={({ target: { value } }) => {
              if (value === "premium") {
                history.push("/premium");
              } else {
                setTimeframe(Number(value));
              }
            }}
          >
            {timeframes
              .slice(premium ? 0 : 2, premium ? timeframes.length : 3)
              .map(({ title, value }) => (
                <option value={value} key={value}>
                  {title}
                </option>
              ))}
            {!premium && (
              <option value="premium">
                Upgarde to Premium to view other timeframes
              </option>
            )}
          </Select>
          <HelpButton>
            <Typography variant="body1">
              {isLoser
                ? `Top BSC losers over a very specific time period of down to 5minutes. Catch major dumps or rug pulls before anyone else.`
                : `Top BSC gainers over a very specific time period of down to 5minutes. Ape into tokens on the breakout and see what is trending!`}
            </Typography>
          </HelpButton>
        </div>
      </div>

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
            {(loading ? [] : data?.topGainers)?.map((row) => (
              <TableRow
                key={row.address}
                className="data-row"
                onClick={() => openNewLink(`/?token=${row.address}`)}
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
    </div>
  );
};

export default TopGainers;
