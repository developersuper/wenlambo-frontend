import React from "react";

const Indicator = ({ loading }) => (
  <div className={`indicator ${loading ? "loading" : ""}`} />
);

export default Indicator;
