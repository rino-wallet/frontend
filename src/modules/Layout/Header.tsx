import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import routes from "../../router/routes";
import { Button, Logo } from "../../components";
import { ReactComponent as Menu } from "./menu.svg";
import { useIsMobile } from "../../hooks";
import { PreventAction } from "../PreventAction";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  landing?: boolean;
}

export const Header: React.FC<Props> = ({ signOut, isAuthenticated, landing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const logoElement = landing ? <Logo white /> : <Logo />;
  const linkClassNames = classNames("block mb-3 md:mb-0 md:inline-block md:px-5", { "text-white": landing });
  return (
    <header className={classNames("px-4 py-6 font-catamaran md:px-16 text-lg uppercase md:flex relative z-10", { "text-white": isMobile && landing })}>
      <div className="flex justify-between items-center ">
        <div>
          <PreventAction content={logoElement}>
            <NavLink to={isAuthenticated ? routes.wallets : routes.home} className="d-block">
              {logoElement}
            </NavLink>
          </PreventAction>
        </div>
        <div className="md:hidden">
          <Button size={Button.size.MEDIUM} onClick={(): void => { setIsOpen((value) => !value); }} icon>
            <Menu />
          </Button>
        </div>
      </div>
      {
        (isOpen || !isMobile) && (
          <div className="text-center md:flex items-center flex-1 md:justify-end">
            {
              isAuthenticated && (
                <div className="md:flex-1">
                  <PreventAction content="Wallets" className="block mb-3 md:mb-0 md:inline-block md:px-5" >
                    <NavLink
                      className={({ isActive }): string => isActive ? `${linkClassNames} font-bold` : linkClassNames}
                      id="nav-link-wallets"
                      to={routes.wallets}
                    >
                      Wallets
                    </NavLink>
                  </PreventAction>
                  <PreventAction content="Account" className="block mb-3 md:mb-0 md:inline-block md:px-5" >
                    <NavLink
                      className={({ isActive }): string => isActive ? `${linkClassNames} font-bold` : linkClassNames}
                      id="nav-link-settings"
                      to={routes.profile}
                      >
                        Account
                      </NavLink>
                  </PreventAction>
                </div>
              )
            }
            {
              isAuthenticated ? (
                <>
                  {
                    landing && (
                      <NavLink
                        id="nav-link-faq"
                        className={({ isActive }): string => `white-text-shadow block mb-3 md:mb-0 md:inline-block md:px-5 ${isActive ? "font-bold" : ""}`}
                        to={routes.faq}
                      >
                        FAQ
                      </NavLink>
                    )
                  }
                  <PreventAction content="Logout" className="block mb-3 md:mb-0 md:inline-block p-0" >
                    <button className="uppercase" name="log-out" onClick={signOut}>Logout</button>
                  </PreventAction>
                </>

              ) : (
                <div>
                  {
                    landing && (
                      <NavLink
                        id="nav-link-faq"
                        className={({ isActive }): string => `white-text-shadow block mb-3 md:mb-0 md:inline-block md:px-5 ${isActive ? "font-bold" : ""}`}
                        to={routes.faq}
                      >
                        FAQ
                      </NavLink>
                    )
                  }
                  <NavLink
                    id="nav-link-register"
                    className={({ isActive }): string => `white-text-shadow block mb-3 md:mb-0 md:inline-block md:px-5 ${isActive ? "font-bold" : ""}`}
                    to={routes.register}
                  >
                    Sign Up
                  </NavLink>
                  <NavLink
                    id="nav-link-login"
                    className={({ isActive }): string => `white-text-shadow block mb-3 md:mb-0 md:inline-block md:px-5 ${isActive ? "font-bold" : ""}`}
                    to={routes.login}
                  >
                    Login
                  </NavLink>
                </div>
              )
            }
          </div>
        )
      }
    </header>
  )
}
