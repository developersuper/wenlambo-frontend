import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import UndoIcon from "@material-ui/icons/Undo";

const ShowButton = ({ currency, blackList, setBlackList }) => {
  const address = currency.id || currency.address;
  const blocked = blackList.includes(address);
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        if (blocked) {
          setBlackList(blackList.filter((item) => item !== address));
        } else {
          setBlackList([...blackList, address]);
        }
      }}
      className="show-button"
    >
      {!blocked && <DeleteIcon />}
      {blocked && <UndoIcon />}
    </IconButton>
  );
};

export default ShowButton;
