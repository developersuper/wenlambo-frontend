import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";

import ModalBody from "components/ModalBody";

const WalletInput = ({ open, setOpen, wallet, setWallet }) => {
  const [address, setAddress] = useState(wallet?.address || "");
  const [alias, setAlias] = useState(wallet?.alias || "");
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <ModalBody>
        <TextField
          label="Alias"
          fullWidth
          margin="normal"
          style={{ margin: 8 }}
          onChange={({ target: { value } }) => setAlias(value)}
          value={alias}
        />
        <TextField
          label="Wallet Address"
          fullWidth
          margin="normal"
          style={{ margin: 8 }}
          onChange={({ target: { value } }) => setAddress(value)}
          value={address}
          disabled={Boolean(wallet)}
        />
        <Button
          className="button-normal"
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(false);
            setWallet({ alias, address });
          }}
        >
          Ok
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default WalletInput;
