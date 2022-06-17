import React from "react";
import { Header } from "./Header";
import Footer from "./Footer";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const LayoutAuth: React.FC<Props> = ({ children, signOut, isAuthenticated }) => (
  <div>
    <div className="min-h-screen flex flex-col md:bg-center md:bg-cover">
      <div className="md:mb-10">
        <Header signOut={signOut} isAuthenticated={isAuthenticated} />
      </div>
      <main
        className="flex flex-col container m-auto text-lg p-5 flex-1 leading-6 mb-10 md:max-w-xl  mx-auto"
      >
        {children}
      </main>
    </div>
    <div className="-mt-10">
      <Footer isAuthenticated={isAuthenticated} showDisclaimer />
    </div>
  </div>
);
