import React from "react";
import { ReactComponent as Logo } from "./logo_white.svg";

export const LayoutMessage: React.FC = ({ children }) => (
  <div className="layout-message">
    <div className="min-h-screen flex flex-col md:bg-center md:bg-cover">
      <main
        className="flex flex-col justify-center container m-auto text-lg p-5 flex-1 leading-6 mb-10 md:max-w-lg mx-auto"
      >
        <Logo width="100%" />
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  </div>
);
