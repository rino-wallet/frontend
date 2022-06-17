import React from "react";

type Props = {
  size?: number;
  stub?: boolean;
};

export const Check: React.FC<Props> = (props) => {
  const {
    size = 16,
    stub = false,
  } = props;
  return (
    <div className={stub ? "inset-0 absolute flex items-center justify-center" : ""} data-qa-selector="green-checkmark">
      <svg style={{ width: size, height: size }} height="77" viewBox="0 0 98 77" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M96.754 14.3092C97.9803 13.1291 97.9802 11.1662 96.754 9.98608L87.9384 1.50206C86.7769 0.384159 84.9395 0.384159 83.7779 1.50206L33.0184 50.3528L15.0377 33.0482C13.8769 31.931 12.0408 31.9302 10.879 33.0464L1.24986 42.2974C0.0218124 43.4773 0.0209656 45.4415 1.24799 46.6224L32.2131 76.4231L96.754 14.3092Z" fill="#55D45B" />
      </svg>
    </div>
  );
};
