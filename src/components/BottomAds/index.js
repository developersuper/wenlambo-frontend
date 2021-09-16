import React from "react";

const BottomAds = () => {
  return (
    <div className="bottom-ads-wrapper">
      <div className="iframe-wrapper">
        <iframe
          data-aa="1672738"
          src="//ad.a-ads.com/1672738?size=300x250"
          scrolling="no"
          style={{
            width: 300,
            height: 250,
            border: 0,
            padding: 0,
            overflow: "hidden",
            float: "right",
          }}
          allowtransparency="true"
        ></iframe>
        <div className="small-ads">
          <iframe
            data-aa="1672745"
            src="//ad.a-ads.com/1672745?size=120x60"
            scrolling="no"
            style={{
              width: 120,
              height: 60,
              border: 0,
              padding: 0,
              overflow: "hidden",
              float: "right",
            }}
            allowtransparency="true"
          ></iframe>
          <iframe
            data-aa="1672798"
            src="//ad.a-ads.com/1672798?size=120x60"
            scrolling="no"
            style={{
              width: 120,
              height: 60,
              border: 0,
              padding: 0,
              overflow: "hidden",
              float: "right",
            }}
            allowtransparency="true"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default BottomAds;
