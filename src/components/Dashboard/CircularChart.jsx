import React from "react";
import PropTypes from "prop-types";

const CircularChart = ({ percentage, strokeColor = "red" }) => {
  return (
    <div className="w-6 h-6">
      <svg viewBox="0 0 40 40" className="circular-chart">
        <path
          className="circle-bg"
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="circle"
          strokeDasharray={`${percentage}, 100`}
          stroke={strokeColor}
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
    </div>
  );
};

CircularChart.propTypes = {
  percentage: PropTypes.number.isRequired,
  strokeColor: PropTypes.string,
};

export default CircularChart;
