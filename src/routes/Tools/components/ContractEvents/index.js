import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Indicator from "components/Indicator";
import TableWrapper from "components/TableWrapper";
import FavoriteButton from "components/FavoriteButton";
import HelpButton from "components/HelpButton";
import PremiumButton from "components/PremiumButton";
import { CONTRACT_EVENTS } from "queries/tools";
import openNewLink from "utils/openNewLink";

const ContractEvents = () => {
  const premium = useSelector((state) => state.account?.lp?.premium);
  const { data, loading } = useQuery(CONTRACT_EVENTS, {
    variables: {
      limit: premium ? 30 : 5,
    },
  });
  const columns = [
    {
      field: "favorite",
      headerName: "",
      render: (row) => <FavoriteButton currency={row} />,
    },
    {
      field: "time",
      headerName: "Time",
      render: (row) => moment(row.unixtime * 1000).format("MM-DD HH:mm:ss"),
    },
    {
      headerName: "Event",
      field: "event",
    },
    {
      headerName: "Name",
      field: "name",
      render: ({ currency: { name, symbol } }) => (
        <span className="name-wrapper">
          <Typography className="name">{name}</Typography>
          <Typography className="symbol">{symbol}</Typography>
        </span>
      ),
    },
  ];
  return (
    <div className="contract-events">
      <div className="contract-events-header">
        <Typography variant="h6" className="title" component="h6">
          Token Events
        </Typography>
        <div className="row-align">
          {!premium && <PremiumButton />}
          <HelpButton>
            <Typography variant="body1">
              <b>New</b>: The token was just made tradable on PancakeSwap
            </Typography>
            <Typography variant="body1">
              <b>Owner</b>: The contract ownership was just renounced
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
            {(loading ? [] : data?.contractEvents)?.map((row) => (
              <TableRow
                key={row.currency.address}
                className="data-row"
                onClick={() => openNewLink(`/?token=${row.currency.address}`)}
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

export default ContractEvents;
