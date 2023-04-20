import React, {
  useEffect, useState,
} from "react";

interface Props {
  loading: boolean;
  placeholder: React.FC;
  numberOfRows?: number;
  minTimeout?: number;
}

export const PlaceholderController: React.FC<Props> = ({
  loading,
  numberOfRows = 1,
  placeholder: Placeholder,
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
        showPlaceholder ? [...new Array(numberOfRows)].map((_, index) => index).map((index) => <Placeholder key={index} />) : children
    }
    </div>
  );
};
