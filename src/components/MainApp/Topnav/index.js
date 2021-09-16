import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Topnav = ({ menuOpen, setMenuOpen }) => {
  return (
    <AppBar position="static" className="top-nav">
      <Box display={{ xs: "block", md: "none" }} m={1}>
        <IconButton onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon />
        </IconButton>
      </Box>
    </AppBar>
  );
};

export default Topnav;
