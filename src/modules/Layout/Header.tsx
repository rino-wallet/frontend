import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import routes from "../../router/routes";
import { Logo, Icon } from "../../components";
import { PUBLIC_APP_URLS_MAP } from "../../constants";
import { Env } from "../../types";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  landing?: boolean;
}

export const Header: React.FC<Props> = ({ signOut, isAuthenticated, landing }) => {
  const logoElement = landing ? <Logo white /> : <Logo />;
  const linkClassNames = classNames("block inline-block px-5 text-2xl md:text-lg cursor-pointer text-gray-500");
  const activeLinkClassNames = classNames("block inline-block px-5 text-2xl md:text-lg cursor-pointer font-bold theme-text-primary");
  return (
    <header className={classNames("px-4 py-6 font-catamaran md:px-16 text-lg uppercase flex relative z-10")}>
      <a href={isAuthenticated ? routes.wallets : PUBLIC_APP_URLS_MAP[process.env.REACT_APP_ENV as Env]} className="d-block">
        {logoElement}
      </a>
      <div className="text-center flex items-center flex-1 justify-end">
        <NavLink
          id="nav-link-faq"
          className={({ isActive }): string => isActive ? activeLinkClassNames : linkClassNames}
          to={routes.faq}
        >
          <span className="hidden md:inline">FAQ</span> <Icon className="md:hidden" name="faq" />
        </NavLink>
        {
          isAuthenticated ? (
            <>
              <NavLink
                className={({ isActive }): string => isActive ? activeLinkClassNames : linkClassNames}
                id="nav-link-wallets"
                to={routes.wallets}
              >
                <span className="hidden md:inline">Wallets</span> <Icon className="md:hidden" name="wallets" />
              </NavLink>
              <NavLink
                className={({ isActive }): string => isActive ? activeLinkClassNames : linkClassNames}
                id="nav-link-settings"
                to={routes.profile}
              >
                <span className="hidden md:inline">Account</span> <Icon className="md:hidden" name="settings-outline" />
              </NavLink>
              <button
                className={`${linkClassNames} md:mb-0 uppercase`}
                name="log-out"
                onClick={signOut}
              >
                <span className="hidden md:inline">Logout</span> <Icon className="md:hidden" name="logout" />
              </button>
            </>
          ) : (
            <>
              <NavLink
                id="nav-link-login"
                className={({ isActive }): string => isActive ? activeLinkClassNames : linkClassNames}
                to={routes.login}
              >
                <span className="hidden md:inline">Login</span> <Icon className="md:hidden" name="login" />
              </NavLink>
              <NavLink
                id="nav-link-register"
                className={({ isActive }): string => `${linkClassNames} hidden lg:block ${isActive ? "font-bold theme-text-primary" : ""}`}
                to={routes.register}
              >
                <span>Sign up</span>
              </NavLink>
            </>
          )
        }
      </div>
    </header>
  )
}
