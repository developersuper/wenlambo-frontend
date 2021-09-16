import React from "react";
import { Link } from "react-router-dom";

const PremiumLink = () => {
  return (
    <Link to="/premium" className="premium-link">
      Upgrade to Premium
    </Link>
  );
};

export default PremiumLink;
