import React from "react";
import IconButton from "@material-ui/core/IconButton";

import BSCIcon from "assets/images/bscscan-icon.jpeg";

const BscButton = ({ path, ...props }) => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        if (path) window.open(`https://bscscan.com/${path}`, "_blank");
      }}
      className="favorite-button"
      {...props}
    >
      <img src={BSCIcon} className={`favorite-icon active rounded`} />
    </IconButton>
  );
};

export default BscButton;
