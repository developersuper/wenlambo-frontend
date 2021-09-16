import React from "react";
import Typography from "@material-ui/core/Typography";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import Grid from "@material-ui/core/Grid";

import BuyLamboBadgeImg from "assets/images/buy-lambo-badge.png";
import Container from "components/Container";
import Indicator from "components/Indicator";
import Paper from "components/Paper";
import Swap from "components/Swap";
import SmallBadge from "components/SmallBadge";

const BuyLambo = () => {
  const lamboAddress = "0x2c7b396d17e3a5184d4901380836de7a72c5cba4";
  return (
    <Container className="buy-lambo">
      <div className="instruction-wrapper">
        <Paper color="dark" className="how-to-buy-lambo">
          <Typography variant="h5" className="title">
            How to buy $LAMBO
          </Typography>
          <Indicator />
          <Typography className="description">
            You can purchase LAMBO directly on this DApp simply by clicking on
            our token name, then using the SWAP feature below the chart.
            Alternatively, you can purchase LAMBO on PancakeSwap. Exchanges will
            be added shortly.
          </Typography>
          <Typography variant="h6" className="contact">
            Contact
          </Typography>
          <Indicator />
          <a
            href={`https://bscscan.com/token/${lamboAddress}`}
            target="_blank"
            className="link-to-contract"
          >
            <SmallBadge
              className="contract-address"
              color="secondary"
              style={{ textTransform: "uppercase" }}
            >
              {lamboAddress}
              <FilterNoneIcon />
            </SmallBadge>
          </a>
        </Paper>
        <img src={BuyLamboBadgeImg} className="buy-lambo-img" />
      </div>
      <Paper className="swap-widget" color="dark">
        <Swap
          address="0x2c7b396d17e3a5184d4901380836de7a72c5cba4"
          symbol="(LAMBO)"
          network="bsc"
        />
      </Paper>
      <Typography variant="h6" className="tokenomic-title">
        Tokenomics
      </Typography>
      <Indicator />
      <Grid container className="tokenomic-list">
        <Grid item xs={12} md={4} className="tokenomic-wrapper">
          <Paper className="tokenomic" color="dark">
            <Typography className="card-title">4%</Typography>
            <Typography className="card-description">
              4% is distributed to holders from each network transaction.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} className="tokenomic-wrapper">
          <Paper className="tokenomic" color="dark">
            <Typography className="card-title">2%</Typography>
            <Typography className="card-description">
              There's a 2% fee on every transaction
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} className="tokenomic-wrapper">
          <Paper className="tokenomic" color="dark">
            <Typography className="card-title">4%</Typography>
            <Typography className="card-description">
              4% is burned, reducing supply and increasing the token value.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BuyLambo;
