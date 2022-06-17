import React from "react";

export const LayoutClear: React.FC = ({ children }) => (
  <main
    className="flex flex-col container m-auto text-lg p-5 flex-1 leading-6 mb-10 md:max-w-screen-md lg:max-w-screen-lg"
  >
    {children}
  </main>
);
