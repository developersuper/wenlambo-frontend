import React, { useState } from "react";
import MaterialPaper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";

const Paper = ({
  padding = 8,
  color = "normal",
  children,
  className,
  expandable = false,
  ref,
  loading,
  style,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <MaterialPaper
      className={`paper ${color} ${expanded ? "expanded" : ""} ${className} ${
        loading ? "loading" : ""
      }`}
      style={{ padding, ...style }}
      ref={ref}
    >
      {expandable && (
        <IconButton
          className="expand-btn"
          aria-label="expand"
          size="small"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <CloseIcon fontSize="inherit" />
          ) : (
            <ZoomOutMapIcon fontSize="inherit" />
          )}
        </IconButton>
      )}
      {children}
    </MaterialPaper>
  );
};

export default Paper;
