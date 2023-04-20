import React, { ReactNode } from "react";
import classNames from "classnames";
import { Spinner } from "../Spinner";

// eslint-disable-next-line
enum Variant {
  GRAY,
  RED,
  GREEN,
  PRIMARY,
  PRIMARY_LIGHT,
  DISABLED,
  BRIGHT_RED,
  INDIGO
}

type Props = {
  variant?: Variant;
  size?: UI_SIZE;
  icon?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  name?: string;
  block?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

// eslint-disable-next-line
export enum UI_SIZE {
  BIG,
  MEDIUM,
  SMALL,
  TINY,
}

export const ICON_SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: "w-16 h-16 rounded-big",
  [UI_SIZE.MEDIUM]: "w-14 h-14 rounded-big",
  [UI_SIZE.SMALL]: "w-8 h-8 rounded-small",
  [UI_SIZE.TINY]: "w-6 h-6 rounded-small",
};

const SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: "px-10 py-4.25 text-lg rounded-big",
  [UI_SIZE.MEDIUM]: "px-8 py-3.75 text-base rounded-big",
  [UI_SIZE.SMALL]: "py-1.25 px-5 text-sm rounded-small",
  [UI_SIZE.TINY]: "py-0.75 px-4 text-xs rounded-small",
};

const VARIANT_MAPS: Record<Variant, string> = {
  [Variant.GRAY]: "bg-white theme-text theme-control-border",
  [Variant.RED]: "bg-white theme-text-error theme-border-error",
  [Variant.GREEN]: "bg-white theme-text-success theme-border-success",
  [Variant.PRIMARY]: "theme-control-primary-gradient text-white border-transparent",
  [Variant.PRIMARY_LIGHT]: "theme-control-primary-gradient-light text-white border-transparent",
  [Variant.DISABLED]: "bg-white text-disabled border-disabled",
  [Variant.BRIGHT_RED]: "theme-bg-red text-white theme-border-error",
  [Variant.INDIGO]: "theme-bg-indigo text-white",
};

export const Button: React.FC<Props> & { variant: typeof Variant; size: typeof UI_SIZE; } = (props) => {
  const {
    children,
    variant = Variant.GRAY,
    size = UI_SIZE.MEDIUM,
    disabled = false,
    type = "button",
    name = "",
    icon = false,
    block = false,
    loading = false,
    className = "",
    onClick,
    onMouseEnter,
    onMouseLeave,
  } = props;
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classNames(
        "relative inline-flex items-center justify-center uppercase font-bold whitespace-no-wrap border border-solid",
        VARIANT_MAPS[disabled ? Variant.DISABLED : variant],
        className,
        icon ? ICON_SIZE_MAPS[size] : SIZE_MAPS[size],
        {
          "cursor-default": disabled,
          "w-full": block,
        },
      )}
      disabled={disabled}
      name={name}
      // eslint-disable-next-line
      type={type}
    >
      { loading && <div className="inset-0 absolute flex items-center justify-center"><Spinner /></div>}
      <div className={classNames({ "opacity-0": loading })}>
        {children}
      </div>
    </button>
  );
};

Button.variant = Variant;
Button.size = UI_SIZE;
