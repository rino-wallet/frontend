import React from "react";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import { Button } from "../../components";
import Footer from "./Footer";
import routes from "../../router/routes";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const LayoutPublicWallet: React.FC<Props> = ({ children, signOut, isAuthenticated }) => (
  <div>
    <div className="min-h-screen flex flex-col md:bg-center md:bg-cover">
      {
        !isAuthenticated && (
          <div className="bg-white theme-border border border-x-0 border-t-0 p-5">
            <div className="container m-auto md:max-w-screen-md lg:max-w-screen-lg flex space-x-5">
              <div className="text-right md:ml-32">
                The owner of this wallet decided to enable and share a read-only view of all activities in real time, a free feature that comes with all RINO wallets. Sign up and give it a try!
              </div>
              <Link
                className="shrink-0"
                id="nav-link-register"
                to={routes.register}
              >
                <Button variant={Button.variant.PRIMARY_LIGHT}>Sign up</Button>
              </Link>
            </div>
          </div>
        )
      }
      <div className="md:mb-10">
        <Header signOut={signOut} isAuthenticated={isAuthenticated} />
      </div>
      <main
        className="flex flex-col container m-auto text-lg p-5 flex-1 leading-6 mb-10 md:max-w-screen-md lg:max-w-screen-lg"
      >
        {children}
      </main>
      <Footer isAuthenticated={isAuthenticated} />
    </div>
  </div>
);
