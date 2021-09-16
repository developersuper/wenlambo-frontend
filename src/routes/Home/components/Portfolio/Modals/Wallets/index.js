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
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { addWallet, updateWallet, removeWallet } from "actions/favorites";
import DiamondIcon from "assets/images/diamond-icon.png";
import ModalBody from "components/ModalBody";
import Paper from "components/Paper";
import PremiumLink from "components/PremiumLink";
import PremiumButton from "components/PremiumButton";
import TableWrapper from "components/TableWrapper";

import WalletInput from "./WalletInput";

const Wallets = ({ address, setWallet: setCurrentWallet }) => {
  const lp = useSelector((state) => state.account?.lp);
  const [open, setOpen] = useState(false);
  const [walletInputOpen, setWalletInputOpen] = useState(false);
  const [wallet, setWallet] = useState(false);
  const wallets = useSelector((state) => state.favorites?.wallets) || [];
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();
  const limit = lp?.premium ? 50 : 2;
  const columns =
    windowWidth >= 760
      ? [
          {
            field: "alias",
            headerName: "Alias",
          },
          {
            field: "address",
            headerName: "Address",
          },
          {
            field: "actions",
            headerName: "",
            render: (wallet) => (
              <div style={{ display: "flex" }}>
                <IconButton
                  onClick={(e) => {
                    setWallet(wallet);
                    setWalletInputOpen(true);
                    e.stopPropagation();
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    dispatch(removeWallet(wallet));
                    e.stopPropagation();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ),
          },
        ]
      : [
          {
            field: "wallets",
            headerName: "Wallets",
            render: (row) => (
              <div>
                <b>{row.alias}</b>
                <br />
                {row.address}
                <br />
                <IconButton
                  onClick={(e) => {
                    setWallet(wallet);
                    setWalletInputOpen(true);

                    e.stopPropagation();
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    dispatch(removeWallet(wallet));

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
        Wallets
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalBody>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <div className="row-align">
                Save up to {limit} wallets
                {!lp?.premium && <PremiumButton />}
              </div>
            </Grid>
            <Grid item>
              <Button
                className="button-normal"
                variant="contained"
                color="primary"
                onClick={() => {
                  setWalletInputOpen(true);
                  setWallet(null);
                }}
                disabled={wallets?.length >= limit}
              >
                Add Wallet
              </Button>
              {walletInputOpen && (
                <WalletInput
                  open={walletInputOpen}
                  setOpen={setWalletInputOpen}
                  wallet={wallet}
                  setWallet={(newWallet) => {
                    if (wallet) {
                      dispatch(updateWallet(newWallet));
                    } else {
                      dispatch(addWallet(newWallet));
                    }
                  }}
                />
              )}
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
                  {wallets.map((row) => (
                    <TableRow
                      key={row.address}
                      onClick={() => {
                        setCurrentWallet(row);
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

export default Wallets;
