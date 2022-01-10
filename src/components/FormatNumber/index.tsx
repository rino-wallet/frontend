import React from "react";
import "./styles.css";

type Props = {
  value: string;
};

const sizeChangeIndex = 4;

export const FormatNumber: React.FC<Props> = ({ value }) => {
  const pointIndex = value.indexOf(".");
  if (pointIndex === -1) {
    return <div className="inline-block">{value}</div>;
  } else {
    const intPart = value.slice(0, pointIndex);
    const decimalPart = value.slice(pointIndex + 1);
    const bigDecimalPart = decimalPart.slice(0, sizeChangeIndex);
    const smallDecimalPart = decimalPart.slice(sizeChangeIndex);
    return (
      <div className="inline-block">
        <span>{intPart}.{bigDecimalPart}</span>
        {smallDecimalPart && <small className="format-number-small">{smallDecimalPart}</small>}
      </div>
    );
  }
}
