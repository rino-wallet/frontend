import React, { ReactNode } from "react";
import classNames from "classnames";

type Tab = {
  value: number;
  text: string;
};

type Props = {
  tabs: Tab[];
  activeTab?: number;
  onChange: (tab: number) => void;
  children?: ReactNode;
};

export const Tabs: React.FC<Props> = (props) => {
  const { tabs, activeTab, children, onChange } = props;
  return (
    <div>
      <div className="flex border-b border-gray-100">
        {
          tabs.map((tab) => (
            <button
              type="button"
              name={`tab-${tab.value}`}
              key={tab.value}
              onClick={(): void => onChange(tab.value)}
              className={classNames(
                "flex items-center justify-center flex-1 uppercase text-sm px-3 py-5 cursor-pointer",
                {
                  "bg-custom-purple-100": tab.value === activeTab,
                  "text-gray-500": tab.value !== activeTab,
                  "text-black": tab.value === activeTab,
              })}
            >
              {tab.text}
            </button>
          ))
        }
      </div>
      {children}
    </div>
  );
}
