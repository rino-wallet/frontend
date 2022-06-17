import React from "react";
import { Icon } from "../Icon";
import { AccessLevel } from "../../types";

interface Props {
  role: AccessLevel;
  className?: string;
  small?: boolean;
}

const roles = new Map();
roles.set(
  "Owner",
  {
    title: "Owner",
    icon: "account",
  },
);
roles.set(
  "View-only",
  {
    title: "Viewer",
    icon: "eye",
  },
);
roles.set(
  "Spender",
  {
    title: "Spender",
    icon: "arrow-down-bold",
  },
);
roles.set(
  "Admin",
  {
    title: "Admin",
    icon: "settings",
  },
);

const WalletRole: React.FC<Props> = ({ role, className, small }) => {
  const r = roles.get(role);
  return (
    <div className={`flex items-center ${className}`} title={r?.title}>
      <Icon className="w-5 flex justify-center mr-2" name={r?.icon} />
      {" "}
      {small ? "" : r?.title}
    </div>
  );
};

export { WalletRole };
