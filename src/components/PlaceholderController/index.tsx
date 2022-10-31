import React, { ReactElement, useEffect, useState } from "react";

interface Props {
  loading: boolean;
  placeholder: ReactElement;
  numberOfRows?: number;
  minTimeout?: number;
}

export const PlaceholderController: React.FC<Props> = ({
  loading,
  numberOfRows = 1,
  placeholder,
  minTimeout = 500,
  children,
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(loading);
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setShowPlaceholder(loading);
      }, minTimeout);
    } else {
      setShowPlaceholder(loading);
    }
  }, [loading]);
  return (
    <div>
      {
        showPlaceholder ? [...new Array(numberOfRows)].map(() => placeholder) : children
    }
    </div>
  );
};
