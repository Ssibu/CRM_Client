import React from "react";
import "./Spinner.css";

const Spinner = ({ size = "2.25em", color = "hsl(214, 97%, 59%)" }) => {
  return (
    <svg
      viewBox="25 25 50 50"
      style={{ width: size }}
      className="spinner-svg"
    >
      <circle
        r="20"
        cy="50"
        cx="50"
        style={{ stroke: color }}
      ></circle>
    </svg>
  );
};

export default Spinner;
