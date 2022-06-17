import React, { useEffect, useState } from "react";

interface Props {
  timeout: number;
  callback?: (() => Promise<any>) | (() => any);
}

export const CountDown: React.FC<Props> = ({ timeout, callback }) => {
  const [s, setS] = useState(timeout);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  useEffect(() => {
    const interval = setInterval(() => {
      setS((value) => {
        if (value > 0) {
          return value - 1;
        }
        clearInterval(interval);
        if (typeof callback === "function") {
          callback();
        }
        return 0;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <span>
      {minutes}
      :
      {`${seconds}`.length === 1 ? `0${seconds}` : seconds}
    </span>
  );
};
