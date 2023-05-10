import React, { ReactNode } from "react";
import classNames from "classnames";
import { Icon, IconName } from "../Icon";

type Tab = {
  value: number;
  text: ReactNode;
  icon?: IconName;
  notification?: number;
};

type Props = {
  tabs: Tab[];
  activeTab?: number;
  onChange?: (tab: number) => void;
  children?: ReactNode;
};

export const Tabs: React.FC<Props> = (props) => {
  const {
    tabs, activeTab, children, onChange,
  } = props;
  return (
    <div className="w-full">
      <div className="flex border-b theme-border">
        {
          tabs.map((tab) => (
            <button
              type="button"
              name={`tab-${tab.value}`}
              key={tab.value}
              onClick={(): void => {
                if (typeof onChange === "function") {
                  onChange(tab.value);
                }
              }}
              className={classNames(
                "flex items-center justify-center flex-1 uppercase text-lg px-3 py-5 border-b-4 border-transparent font-catamaran",
                {
                  "border-orange-800": tab.value === activeTab,
                  "theme-text-secondary": tab.value !== activeTab,
                  "text-black": tab.value === activeTab,
                  "cursor-default": typeof onChange !== "function",
                  "cursor-pointer": typeof onChange === "function",
                },
              )}
            >
              {tab.icon ? <Icon className="theme-text-red mr-2" name={tab.icon} /> : ""}
              {tab.text}
              {" "}
              {
                !!tab.notification && (
                  <div className="inline-flex items-center justify-center text-white w-6 h-6 mr-2 theme-control-primary-gradient rounded-full ml-1" data-qa-selector="pending_share_red_dot">
                    {tab.notification}
                  </div>
                )
              }
            </button>
          ))
        }
      </div>
      {children}
    </div>
  );
};
