import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useWindowWidth } from "@react-hook/window-size";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";

import { addToken, removeToken } from "actions/favorites";
import DiamondIcon from "assets/images/diamond-icon.png";
import ModalBody from "components/ModalBody";
import Paper from "components/Paper";
import TableWrapper from "components/TableWrapper";

import SearchToken from "../SearchToken";

const Tokens = ({ address, setToken }) => {
  const [open, setOpen] = useState(false);
  const tokens = useSelector((state) => state.favorites?.tokens) || [];
  const network = useSelector((state) => state.favorites?.network) || "bsc";
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();
  const columns =
    windowWidth >= 760
      ? [
          {
            field: "name",
            headerName: "Name",
          },
          {
            field: "symbol",
            headerName: "Symbol",
          },
          {
            field: "address",
            headerName: "Address",
          },
          {
            field: "actions",
            headerName: "",
            render: (token) => (
              <IconButton
                onClick={(e) => {
                  dispatch(removeToken(token));
                  e.stopPropagation();
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
        ]
      : [
          {
            field: "tokens",
            headerName: "Tokens",
            render: (token) => (
              <div>
                <b>
                  {token.name}({token.symbol})
                </b>
                <br />
                {token.address}
                <br />
                <IconButton
                  onClick={(e) => {
                    dispatch(removeToken(token));
                    e.stopPropagation();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ),
          },
        ];
  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        <img src={DiamondIcon} className="button-icon" />
        Tokens
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalBody>
          <Grid container justify="flex-end">
            <Grid item>
              <SearchToken
                button={(setOpen) => (
                  <Button
                    className="button-normal"
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                  >
                    Add Token
                  </Button>
                )}
                setCurrency={(token) =>
                  dispatch(addToken({ ...token, id: token.address, network }))
                }
              />
            </Grid>
          </Grid>
          <Paper color="dark" className="full-width" style={{ minHeight: 300 }}>
            <TableWrapper>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {columns.map(({ field, headerName }) => (
                      <TableCell key={field}>{headerName}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens
                    .filter((token) => (token.network || "bsc") === network)
                    .map((row) => (
                      <TableRow
                        key={row.address}
                        onClick={() => {
                          setToken(row);
                          setOpen(false);
                        }}
                        className={`data-row ${
                          address === row.address ? "active" : ""
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
        </ModalBody>
      </Modal>
    </>
  );
};

export default Tokens;
