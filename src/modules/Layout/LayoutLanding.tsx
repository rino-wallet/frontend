import React from "react";
import { Header } from "./Header";
import Footer from "./Footer";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const LayoutLanding: React.FC<Props> = ({ children, signOut, isAuthenticated }) => (
  <div>
    <div className="min-h-screen flex flex-col md:bg-center md:bg-cover">
      <div className="h-0">
        <Header signOut={signOut} isAuthenticated={isAuthenticated} landing />
      </div>
      <main className="flex-1 text-lg leading-6">
        {children}
      </main>
      <Footer isAuthenticated={isAuthenticated} showDisclaimer dark />
    </div>
  </div>
);
