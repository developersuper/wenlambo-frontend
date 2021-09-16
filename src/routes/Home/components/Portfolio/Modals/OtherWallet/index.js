import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";

import WalletIcon from "assets/images/wallet-icon.png";
import ModalBody from "components/ModalBody";

const OtherWallet = ({ setAddress }) => {
  const [open, setOpen] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        <img src={WalletIcon} className="button-icon" />
        Other Wallet
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ModalBody>
          <TextField
            label="Wallet Address"
            fullWidth
            margin="normal"
            style={{ margin: 8 }}
            onChange={({ target: { value } }) => setInputAddress(value)}
          />
          <Button
            className="button-normal"
            variant="contained"
            color="primary"
            onClick={() => {
              setOpen(false);
              setAddress(inputAddress);
            }}
          >
            Ok
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default OtherWallet;
