import React, { ReactNode } from "react";
import classNames from "classnames";

type Tab = {
  value: number;
  text: ReactNode;
};

type Props = {
  tabs: Tab[];
  activeTab?: number;
  onChange?: (tab: number) => void;
  children?: ReactNode;
  tabsWithNotification?: number[];
};

export const Tabs: React.FC<Props> = (props) => {
  const {
    tabs, activeTab, children, onChange, tabsWithNotification,
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
              {tab.text}
              {" "}
              {tabsWithNotification?.includes(tab.value)
                ? <span className="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full ml-1" data-qa-selector="pending_share_red_dot" /> : null}
            </button>
          ))
        }
      </div>
      {children}
    </div>
  );
};
