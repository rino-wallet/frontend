import React, { ReactNode } from "react";
import classNames from "classnames";
import { UI_SIZE, UI_SIZE_MAP, UI_ROUNDED_SIZE_MAPS } from "../../constants";
import { Spinner } from "../Spinner";

// eslint-disable-next-line
enum Variant {
  GRAY,
  RED,
  GREEN,
}

type Props = {
  variant?: Variant;
  size?: UI_SIZE;
  rounded?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  name?: string;
  block?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const VARIANT_MAPS: Record<Variant, string> = {
  [Variant.GRAY]: "bg-white border-gray-500 text-gray-900",
  [Variant.RED]: "bg-white border-red-500 text-red-500",
  [Variant.GREEN]: "bg-white border-green-500 text-green-500",
};

const SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: `px-7 ${UI_SIZE_MAP[UI_SIZE.BIG]}`,
  [UI_SIZE.MEDIUM]: `px-5 ${UI_SIZE_MAP[UI_SIZE.MEDIUM]}`,
  [UI_SIZE.SMALL]: `px-3 ${UI_SIZE_MAP[UI_SIZE.SMALL]}`,
};

export const Button: React.FC<Props> & { variant: typeof Variant; size: typeof UI_SIZE; } = (props) => {
  const {
    children,
    variant = Variant.GRAY,
    size = UI_SIZE.BIG,
    disabled = false,
    type = "button",
    name = "",
    rounded = false,
    block = false,
    loading = false,
    onClick,
  } = props;
  return (
    <button
      onClick={onClick}
      className={classNames(
        "relative inline-flex items-center justify-center rounded-full font-medium whitespace-no-wrap border-solid border disabled:opacity-50",
        VARIANT_MAPS[variant],
        rounded ? UI_ROUNDED_SIZE_MAPS[size] : SIZE_MAPS[size],
        {
          "cursor-default": disabled,
          "w-full": block,
        }
      )}
      disabled={disabled}
      name={name}
      type={type}
    >
      { loading && <div className="inset-0 absolute flex items-center justify-center"><Spinner /></div>}
      <div className={classNames({"opacity-0": loading})}>
        {children}
      </div>
    </button>
  );
}

Button.variant = Variant;
Button.size = UI_SIZE;