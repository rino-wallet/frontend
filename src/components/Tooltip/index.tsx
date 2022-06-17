import React, { ReactNode } from "react";
import "./styles.css";

type Props = {
  content?: ReactNode;
  disable?: boolean;
  className?: string;
};

export const Tooltip: React.FC<Props> = ({
  content, children, disable = false, className,
}) => (
  <div
    className={`tooltip inline-block relative z-10 ${className}`}
  >
    {children}
    {disable ? null : (
      <div
        className="tooltip__content absolute bottom-full left-1/2 transform -translate-x-1/2 rounded-medium mb-3 px-3 py-2 border theme-border border-solid bg-white theme-text"
      >
        {content}
        <div className="w-8 overflow-hidden inline-block absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="h-4 w-4 bg-white border theme-border -rotate-45 transform origin-top-left" />
        </div>
      </div>
    )}
  </div>
);
