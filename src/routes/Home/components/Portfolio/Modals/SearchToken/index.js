import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

import WalletIcon from "assets/images/wallet-icon.png";
import SymbolFinder from "components/SymbolFinder";
import ModalBody from "components/ModalBody";

const SearchToken = ({ setCurrency, button }) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);
  return (
    <>
      {button ? (
        button(setOpen)
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          <img src={WalletIcon} className="button-icon" />
          Search Token
        </Button>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalBody>
          <SymbolFinder setCurrency={setToken} currency={token} />
          <Button
            className="button-normal"
            variant="contained"
            color="primary"
            onClick={() => {
              setOpen(false);
              setCurrency(token);
            }}
            disabled={!token?.symbol}
          >
            Ok
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SearchToken;
