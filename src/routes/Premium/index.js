import React from "react";
import { useSelector } from "react-redux";
import currencyFormatter from "currency-formatter";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";

import ArrowImg from "assets/images/arrow.png";
import PremiumImg from "assets/images/premium.png";
import StarCircleImg from "assets/images/star-circle-icon.png";
import LPAdImg from "assets/images/lp-ad.png";
import LPCircleImg from "assets/images/lp-circle.png";
import RocketImg from "assets/images/rocket.png";
import Container from "components/Container";
import Paper from "components/Paper";
import Indicator from "components/Indicator";

const pancakeLPUrl =
  "https://exchange.pancakeswap.finance/#/add/BNB/0x2c7b396d17e3a5184d4901380836de7a72c5cba4";
const freeFeatures = [
  {
    title: "Dashboard",
    features: [
      "Wallet connect (Trustwallet & Metamask)",
      "Diamond tokens (save & track favourite tokens)",
      "Diamond wallets (save any 2 wallets to track as favourites)",
      "Search “Other wallet” (search any other wallet balance and portfolio)",
      "Search token (search any BSC token by name or contract code)",
      "View token chart with chart tools and token info",
      "Trending tokens list (DApp and Pancakeswap trending)",
      "Swap feature (swap any of your tokens on the BSC network)",
      "Trade history (previous 5 trade history results)",
      "Hide small balances button (hide any balances below $0.10)",
      "Pair explorer (discover new charts and transaction data.",
      "Rocket tokens (vote for your favourite tokens) coming soon*",
    ],
  },
  {
    title: "Tools",
    right: true,
    features: [
      "Top 5 BSC gainers displayed (30min upwards)",
      "Top 5 BSC losers displayed (30min upwards)",
      "Latest 5 Events (added to Pancakeswap or owner renounced)",
      "Rug checker (view contract owners transaction details)",
    ],
  },
  {
    title: "Multichart",
    right: true,
    features: ["Top 8 charts"],
  },
  {
    title: "Phone App",
    right: true,
    features: ["Limited access to phone features (iOS & Android)"],
  },
];

const premiumFeatures = [
  {
    title: "Dashboard",
    features: [
      "Diamond wallets (up to 50 wallets)",
      "Extended trade history (50 transactions)",
      "Transaction alerts (show whales & bots)",
      "Choose ANY currency (USD, GBP, JPY, EUR, ZAR)",
      "Hide Ads (hides all ads on the DApp)",
    ],
  },
  {
    title: "Multichart",
    features: ["18 charts visible"],
  },
  {
    title: "Tools",
    right: true,
    features: [
      "Additional top gainers (view 30 variants)",
      "Additional top losers (view 30 variants)",
      "Additional token events (view 30 variants)",
      "Rug Detector (scan contract details for flaw)",
      "Additional new tools will be premium by default",
    ],
  },
  {
    title: "Phone App",
    right: true,
    features: ["Access to premium phone features (iOS & Android)"],
  },
];

const Premium = () => {
  const lp = useSelector((state) => state.account?.lp);
  const premium = lp?.premium;
  const subscribeButton = (
    <Button
      className="subscription-button"
      variant="outlined"
      onClick={() => window.open(pancakeLPUrl, "_blank")}
    >
      GET SUBSCRIPTION NOW
    </Button>
  );
  const currentSubscriptionButton = (
    <Button className="subscription-button" variant="outlined">
      Your current subscription
    </Button>
  );
  return (
    <Container className="premium">
      <Grid container className="premium-container">
        <Grid item xs={12} className="wrapper">
          <Typography variant="h5" className="title">
            Premium Features
          </Typography>
          <Indicator />
          <Typography className="description">
            <br />
            TIER 1 - Basic features are FREE to ACCESS without holding any LAMBO
            Token.
            <br />
            TIER 2 - Upgrade to Premium by holding $150 of LAMBO/BNB LP.
            <br />
          </Typography>
        </Grid>
        <Grid item xs={12} className="lp-holding-wrapper">
          <div className="lp-holding">
            <img src={LPCircleImg} className="lp-circle" />
            <Typography className="usd-value">
              {currencyFormatter.format(lp?.usdValue || 0, {
                locale: "en-US",
                precision: 0,
              })}
            </Typography>
            <Typography className="percentage">
              {currencyFormatter.format(lp?.percentage || 0, {
                locale: "en-US",
                format: "%v%",
                precision: 3,
              })}
            </Typography>
            <Typography className="label">LAMBO-BNB LP</Typography>
          </div>
          <Hidden xsDown>
            <div className="ad-wrapper">
              <div>
                <Hidden smDown>
                  <img src={LPAdImg} className="lp-ad" />
                </Hidden>
              </div>
              <Typography className="label">LP V2 HOLDINGS</Typography>
              <div />
            </div>
          </Hidden>
        </Grid>
        <Grid item xs={12} md={4} className="feature-block">
          <Paper color="dark">
            <img src={StarCircleImg} className="image" />
            <Typography className="text">
              Earn liquidy pool rewards when you hold LAMBO-BNB LP as well as
              getting Premium features on the DApp and Mobile App.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} className="feature-block">
          <Paper color="dark">
            <img src={RocketImg} className="image" />
            <Typography className="text">
              Earn trading fees from the trades that happen in the pool,
              proportional to the share of the total liquidity provided.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} className="feature-block">
          <Paper color="dark">
            <img src={ArrowImg} className="image" />
            <Typography className="text">
              Future features for Premium users include our Mobile App, Wallet,
              LamboSwap, Staking, NFT, DEX and more Tools.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} className="premium-features features-block">
          <div className="features-block-header">
            <img src={PremiumImg} className="premium-img" />
            <div className="features-block-title">
              <b className="big">UNLOCK </b>{" "}
              <b className="yellow">Premium Access</b>
              <div className="features-block-subheading">
                by holding <span className="yellow">$150</span> worth of{" "}
                <a
                  href={pancakeLPUrl}
                  target="_blank"
                  className="pancake-lp-link"
                >
                  LAMBO/BNB LP
                </a>
              </div>
            </div>
            {!premium && subscribeButton}
            {premium && currentSubscriptionButton}
          </div>
          <Grid container>
            <Grid item xs={12} md={6}>
              {premiumFeatures
                .filter(({ right }) => !right)
                .map(({ title, features }) => (
                  <div className="features-list" key={title}>
                    <div className="features-title">{title}</div>
                    {features.map((feature) => (
                      <div className="feature" key={feature}>
                        <div>✓</div>
                        {feature}
                      </div>
                    ))}
                  </div>
                ))}
            </Grid>
            <Grid item xs={12} md={6}>
              {premiumFeatures
                .filter(({ right }) => right)
                .map(({ title, features }) => (
                  <div className="features-list" key={title}>
                    <div className="features-title">{title}</div>
                    {features.map((feature) => (
                      <div className="feature" key={feature}>
                        <div>✓</div>
                        {feature}
                      </div>
                    ))}
                  </div>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Premium;
