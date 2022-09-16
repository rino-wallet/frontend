import React from "react";
import { Header } from "./Header";
import Footer from "./Footer";
import { useAccountType } from "../../hooks";
import routes from "../../router/routes";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const LayoutDefault: React.FC<Props> = ({ children, signOut, isAuthenticated }) => {
  const { isConsumer } = useAccountType();
  return (
    <div>
      {
        isConsumer && (
          <div className="bg-white theme-border border border-x-0 border-t-0 p-5">
            <div className="container m-auto md:max-w-screen-md lg:max-w-screen-lg flex justify-center space-x-5">
              <div className="text-center">
                <p>You are using the free version of RINO. If you are a business, you might be interested in our enterprise offering.</p>
                <a className="theme-text-primary" target="_blank" rel="noreferrer" href={routes.static.enterprise.landing}>Click here to learn more.</a>
              </div>
            </div>
          </div>
        )
      }
      <div className="min-h-screen flex flex-col md:bg-center md:bg-cover">
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
};
