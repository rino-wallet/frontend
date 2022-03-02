import React, { ReactNode } from "react";
import classNames from "classnames";

// eslint-disable-next-line
enum Variant {
  RED,
  GREEN,
  YELLOW,
  GRAY,
}

type Props = {
  variant: Variant;
  children?: ReactNode;
};

const VARIANT_MAPS: Record<Variant, string> = {
  [Variant.GRAY]: "bg-gray-200 text-gray-600",
  [Variant.YELLOW]: "bg-yellow-100 text-yellow-600",
  [Variant.RED]: "bg-red-100 text-red-600",
  [Variant.GREEN]: "bg-green-100 text-green-600",
};

export const Status: React.FC<Props> & { variant: typeof Variant;} = (props) => {
  const {
    children,
    variant = Variant.GRAY,
  } = props;
  return (
    <div
    data-qa-selector="tx-status"
      className={classNames(
        "inline-flex items-center justify-center rounded-full font-medium whitespace-no-wrap text-sm py-1.25 px-4 uppercase",
        VARIANT_MAPS[variant],
      )}
    >
      {children}
    </div>
  );
}

Status.variant = Variant;
