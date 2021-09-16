import React from "react";
import { useSelector } from "react-redux";

import Banner from "assets/images/lambo-banner.png";

const TopAds = () => {
  const premium = useSelector((state) => state.account?.lp?.premium);
  if (premium) return null;
  return (
    <div className="ads-wrapper">
      <div className="iframe-wrapper">
        <iframe
          data-aa="1672631"
          src="//ad.a-ads.com/1672631?size=728x90"
          scrolling="no"
          style={{
            width: 728,
            height: 90,
            border: 0,
            padding: 0,
            overflow: "hidden",
            float: "right",
          }}
          allowtransparency="true"
        ></iframe>
      </div>
      <img className="banner" src={Banner}></img>
    </div>
  );
};

export default TopAds;
