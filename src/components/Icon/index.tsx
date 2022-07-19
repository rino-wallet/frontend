import React from "react";
import "./style.css";

export type IconName = "checvron_up" | "checvron_down" | "plus" | "copy" | "cross" | "dot" | "checvron_left" | "arrow_right" | "arrow_left" | "qrcode" | "refresh" | "check" | "caret_down" | "caret_up" | "checvron_right" | "faq" | "wallets" | "login" | "logout" | "account" | "account-outline" | "settings" | "settings-outline" | "eye" | "arrow-down-bold" | "info" | "send" | "get" | "send_get" | "accounts-outline" | "two-way-arrow";

interface Props {
  name: IconName;
  className?: string;
  title?: string;
}

const Icon: React.FC<Props> = ({ name, className, title }) => (
  <i title={title} className={`icon-${name} ${className} leading-none`} />
);

export { Icon };
