import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

import { setLP } from "actions/account";
import ConnectButton from "components/ConnectButton";
import { LAMBO_LP } from "queries/balance";

import Leftnav from "./Leftnav";
import Topnav from "./Topnav";

const MainApp = ({ children }) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState();
  const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        // Purple and green play nicely together.
        main: "#5c0eba",
      },
    },
  });
  let walletAddress = useSelector((state) => state.account?.address);
  // walletAddress = "0x7536592bb74b5d62eb82e8b93b17eed4eed9a85c";
  const { data, loading } = useQuery(LAMBO_LP, {
    skip: !walletAddress,
    variables: {
      walletAddress,
    },
  });
  useEffect(() => {
    dispatch(
      setLP({
        ...data?.lamboLP,
        premium: (data?.lamboLP?.usdValue || 0) >= 150,
      })
    );
  }, [data]);

  useEffect(() => {
    const c = document.createComment("a-ads verification code 12475492 ");
    document.head.appendChild(c);
  }, []);

  useEffect(() => {
    const rootElement = document.body;
    if (menuOpen) rootElement.classList.add("no-scroll");
    else rootElement.classList.remove("no-scroll");
  }, [menuOpen]);

  return (
    <ThemeProvider theme={theme}>
      <ConnectButton hide />
      <Topnav setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <Leftnav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="body">{children}</div>
    </ThemeProvider>
  );
};

export default MainApp;
