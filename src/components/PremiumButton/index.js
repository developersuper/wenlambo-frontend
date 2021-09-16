import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import shieldStar from "@iconify-icons/mdi/shield-star";

import HelpButton from "components/HelpButton";

const PremiumButton = ({ full = true, ...props }) => {
  return (
    <Link to="/premium" style={{ margin: "5px 10px" }}>
      <HelpButton
        icon={<Icon icon={shieldStar} color="#D2BC06" />}
        hover
        buttonClass="big"
        {...props}
      >
        Upgrade to Premium for {full ? "full features" : "this feature"}
      </HelpButton>
    </Link>
  );
};

export default PremiumButton;
