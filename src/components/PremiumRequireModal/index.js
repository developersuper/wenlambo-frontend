import React from "react";
import { Link } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

import ModalBody from "components/ModalBody";

const PremiumRequireModal = ({ open, setOpen }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <ModalBody>
        <Typography variant="body1">
          Please upgrade to Premium to use this feature
        </Typography>
        <Link to="/premium" style={{ margin: "5px 10px" }}>
          <Button className="button-normal margin-top20" fullWidth>
            Go to Premium
          </Button>
        </Link>
      </ModalBody>
    </Modal>
  );
};

export default PremiumRequireModal;
