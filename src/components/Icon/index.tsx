import React from "react";
import "./style.css";

interface Props {
  name: "checvron_up" | "checvron_down" | "plus" | "copy" | "cross" | "dot" | "checvron_left" | "arrow_right" | "arrow_left" | "qrcode" | "refresh" | "check" | "caret_down" | "caret_up" | "checvron_right";
  className?: string;
  title?: string;
}

const Icon: React.FC<Props> = ({ name, className, title }) => (
  <i title={title} className={`icon-${name} ${className} leading-none`} />
);

export { Icon };
