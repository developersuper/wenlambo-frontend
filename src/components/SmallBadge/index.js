import React from "react";
import Chip from "@material-ui/core/Chip";

const SmallBadge = ({ children, className, ...rest }) => (
  <Chip className={`${className} small-badge`} label={children} {...rest} />
);

export default SmallBadge;
