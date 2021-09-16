import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { TextField, Button, Grid, Modal } from "@material-ui/core";

import Indicator from "components/Indicator";
import SymbolFinder from "components/SymbolFinder";
import PremiumButton from "components/PremiumButton";
import PremiumRequireModal from "components/PremiumRequireModal";
import { RUGPULL } from "queries/tools";

const getDate = () => {
  let today = new Date();
  const day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
  const month =
    today.getMonth() < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
  const year = today.getFullYear();
  const seconds =
    today.getSeconds().toString().length == 1
      ? "0" + today.getSeconds()
      : today.getSeconds();
  const minutes =
    today.getMinutes().toString().length == 1
      ? "0" + today.getMinutes()
      : today.getMinutes();
  const hours =
    today.getHours().toString().length == 1
      ? "0" + today.getHours()
      : today.getHours();
  const ampm = today.getHours() >= 12 ? "PM" : "AM";
  today = `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  return today;
};

const Results = ({ scanned, passed, transferFunction, result }) => {
  return (
    <div className="scanner-results">
      <p className="time">Scan started at: {getDate()}</p>
      <p className="text-pink">Scanning contract...</p>
      <p className="text-lightblue">
        <span className="text-pink">Functions: </span>
        {scanned} functions were scanned in this smart contract.
      </p>
      <p className="text-green">
        <span className="text-pink">Functions: </span>
        {passed} functions were found on our whitelist and follow safety
        pattern.
      </p>
      {scanned - passed > 0 && (
        <p className="text-lightyello">
          <span className="text-pink">Functions: </span>
          {scanned - passed} functions were not found in our whitelist.
        </p>
      )}
      <br />
      <br />
      <p className="text-green">
        <span className="text-pink">Transfer functions: </span>
        The transfer function is {transferFunction ? "" : "not "}secure and uses
        all safety pattern.
      </p>
      <br />
      <br />
      <p className="text-yello">
        <span className="text-pink">Result: </span>
        {result ? (
          <span className="text-yellow">
            {scanned - passed === 0 ? "Passed." : "Passed but attention."}
          </span>
        ) : (
          <span className="text-red">Not passed.</span>
        )}
      </p>
    </div>
  );
};

const ContractScanner = () => {
  const premium = useSelector((state) => state.account?.lp?.premium);
  const network = useSelector((state) => state.favorites?.network || "bsc");
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPremium, setOpenPremium] = useState(false);
  const [findResult, setFindResult] = useState("");
  const [contract, setContract] = useState("");
  const bottomRef = useRef();
  const [getScanResult, { loading, data }] = useLazyQuery(RUGPULL, {
    fetchPolicy: "network-only",
  });

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleOpen = () => {
    setOpen(true);
    setToken(null);
    setFindResult("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const findContract = () => {
    if (network === "bsc") {
      setFindResult(`https://bscscan.com/address/${token?.address}/#code`);
    } else {
      setFindResult(`https://etherscan.io/address/${token?.address}/#code`);
    }
  };

  const handleScan = () => {
    getScanResult({ variables: { contract } });
  };

  useEffect(() => {
    if (token?.address) {
      findContract();
    }
  }, [token?.address]);

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  return (
    <div className="contract-scanner">
      <Modal open={open} onClose={handleClose}>
        <div className="scanner-modal">
          <Grid>
            <Typography color="white" className="scanner-modal-title">
              Need help to find the code?
            </Typography>
            <div className="scanner-modal-find">
              <SymbolFinder
                setCurrency={setToken}
                currency={token}
                title="Enter token name / address..."
              />
            </div>
            {findResult !== "" && (
              <div className="scanner-modal-found">
                <p>
                  Click in the link bellow and copy the code in the first block.
                </p>
                <a href={findResult} className="small-link" target="_blank">
                  {findResult}
                </a>
              </div>
            )}
          </Grid>
        </div>
      </Modal>
      <div className="row-align space-between">
        <Typography variant="h6" className="title" component="h6">
          Contract Scanner
        </Typography>
        {!premium && <PremiumButton full={false} />}
      </div>

      <PremiumRequireModal open={openPremium} setOpen={setOpenPremium} />
      <Indicator />
      <Grid
        container
        direction="column"
        justifycontent="center"
        alignItems="center"
        className="margin-top20"
      >
        <Grid container item>
          <Typography
            component="span"
            onClick={handleOpen}
            className="contract-help-subtitle"
          >
            How can I find the smart contract code?
          </Typography>
        </Grid>
        <TextField
          fullWidth
          multiline
          rows={12}
          placeholder="Paste a solidity contract here..."
          variant="outlined"
          onChange={({ target: { value } }) => setContract(value)}
        />
        <Button
          className="button-normal margin-top20"
          fullWidth
          onClick={() => {
            if (premium) {
              handleScan();
            } else {
              setOpenPremium(true);
            }
          }}
        >
          SCAN
        </Button>
      </Grid>
      {data && (
        <Results
          scanned={data.rugPull.totalFunctions}
          passed={data.rugPull.whitelistFunctions}
          transferFunction={data.rugPull.transferSafe}
          result={data.rugPull.transferSafe}
        />
      )}
      <div ref={bottomRef} className="bottom-div"></div>
    </div>
  );
};

export default ContractScanner;
