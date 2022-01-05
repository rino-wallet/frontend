import React from "react";

type Props = {
  size?: number;
  stub?: boolean;
};

export const Warning: React.FC<Props> = (props) => {
  const {
    size = 16,
    stub = false,
  } = props;
  return (
    <div className={stub ? "inset-0 absolute flex items-center justify-center" : ""}>
      <svg style={{ width: size,  height: size }} fill="rgba(255, 129, 67, 0.8)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 5.177l8.631 15.823h-17.262l8.631-15.823zm0-4.177l-12 22h24l-12-22zm-1 9h2v6h-2v-6zm1 9.75c-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25 1.25.56 1.25 1.25-.561 1.25-1.25 1.25z"/>
      </svg>
    </div>
  );
}
