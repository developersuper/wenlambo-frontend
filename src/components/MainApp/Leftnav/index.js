import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { Icon } from "@iconify/react";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import BuildIcon from "@material-ui/icons/Build";
import AppsIcon from "@material-ui/icons/Apps";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AmpStoriesIcon from "@material-ui/icons/AmpStories";
import HomeIcon from "@material-ui/icons/Home";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import MultilineChartIcon from "@material-ui/icons/MultilineChart";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import shieldStar from "@iconify-icons/mdi/shield-star";
import detectiveIcon from "@iconify-icons/emojione-monotone/detective";

import Logo from "assets/images/logo.png";

const menuItems = [
  { path: "/", title: "Dashboard", Icon: HomeIcon },
  { path: "/tools", title: "Tools", Icon: BuildIcon },
  {
    path: "/rug-detector",
    title: "Rug Detector",
    Icon: () => <Icon icon={detectiveIcon} width="25" height="22" />,
  },
  {
    path: "/premium",
    title: "Premium",
    Icon: () => <Icon icon={shieldStar} width="25" height="22" />,
  },
  {
    path: "/multi-chart",
    title: "Multi Chart",
    Icon: AppsIcon,
  },
  { path: "/buy-lambo", title: "Buy $Lambo", Icon: AttachMoneyIcon },
  { path: "/promote", title: "Promote", Icon: LoyaltyIcon },
  {
    path: "/stake",
    title: "Stake (Soon)",
    Icon: AmpStoriesIcon,
    disabled: true,
  },
  { path: "/nft", title: "Nft (Soon)", Icon: WallpaperIcon, disabled: true },
  {
    path: "/dex",
    title: "Dex (Soon)",
    Icon: MultilineChartIcon,
    disabled: true,
  },
  {
    path: "https://wen-lambo.com",
    title: "Home Page",
    Icon: () => <img src={Logo} style={{ width: 30 }} />,
    external: true,
  },
];

const Leftnav = ({ location, open, onClose }) => {
  useEffect(() => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }, [location.pathname]);
  return (
    <>
      {open && (
        <Box
          display={{ xs: "block", md: "none" }}
          m={1}
          className="overlay"
          onClick={onClose}
        ></Box>
      )}
      <div
        className={`left-nav ${open ? "open" : ""}`}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <Link to="/">
          <img src={Logo} className="logo" />
        </Link>
        <List>
          {menuItems.map(({ path, title, Icon, disabled, external }) => (
            <ListItem
              button
              component={disabled ? undefined : Link}
              to={external || disabled ? "" : path}
              key={path}
              className={`menu-bar-item ${
                (path === "/" && location.pathname === "/") ||
                (path !== "/" && location.pathname.startsWith(path))
                  ? "active"
                  : ""
              } ${disabled ? "disabled" : ""}`}
              onClick={() => {
                if (external) window.open(path, "_blank");
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      </div>
    </>
  );
};

export default withRouter(Leftnav);
