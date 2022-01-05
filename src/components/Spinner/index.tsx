import React from "react";

type Props = {
  size?: number;
  stub?: boolean;
};

export const Spinner: React.FC<Props> = (props) => {
  const {
    size = 16,
    stub = false,
  } = props;
  return (
    <div className={stub ? "inset-0 absolute flex items-center justify-center bg-white bg-opacity-60" : ""}>
      <svg className="animate-spin" style={{ width: size,  height: size }} width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 42.5C0 19.0277 19.0292 0 42.5024 0C57.6452 0 70.9354 7.92108 78.4589 19.8291L80.3302 22.791L66.1592 31.7243L64.2917 28.7684C59.7242 21.539 51.6713 16.75 42.5024 16.75C28.2798 16.75 16.7506 28.2789 16.7506 42.5C16.7506 56.7211 28.2798 68.25 42.5024 68.25H46.0024V85H42.5024C19.0292 85 0 65.9723 0 42.5Z" fill="#BA48FF"/>
      </svg>
    </div>
  );
}
