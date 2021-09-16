import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from "@material-ui/icons/Help";

const HelpButton = ({
  onClick,
  icon,
  hover,
  buttonClass,
  children,
  popoverProps,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        if (hover) handleClick(e);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        if (hover) handleClose();
      }}
    >
      <IconButton
        className={`help-btn ${buttonClass}`}
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
          if (!hover) handleClick(e);
        }}
        {...props}
      >
        {icon || <HelpIcon fontSize="inherit" />}
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className={hover ? "popover-hover" : ""}
        {...popoverProps}
      >
        <div className="help-button-popover">{children}</div>
      </Popover>
    </div>
  );
};

export default HelpButton;
