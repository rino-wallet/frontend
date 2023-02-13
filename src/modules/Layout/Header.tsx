import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import routes from "../../router/routes";
import { Logo, Icon } from "../../components";
import { useAccountType, useIsMobile } from "../../hooks";
import { showSupportModal } from "../SupportModal";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const Header: React.FC<Props> = ({ signOut, isAuthenticated }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isEnterprise } = useAccountType();
  const links = isEnterprise ? routes.static.enterprise : routes.static.consumer;
  const linkClassNames = "block px-10 py-4 text-2xl whitespace-nowrap font-bold cursor-pointer md:text-lg md:px-5 md:py-0";
  const activeLinkClassNames = `${linkClassNames} theme-text-primary`;

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className={classNames("px-4 py-6 font-catamaran md:px-16 text-lg uppercase flex relative z-20 justify-between items-center")}>
      <a href={isAuthenticated ? routes.wallets : links.landing} className="d-block">
        <Logo />
      </a>
      <nav className="relative flex items-center" ref={dropdownRef}>
        <button type="button" className="cursor-pointer md:hidden" onClick={() => setIsMenuOpen((v) => !v)}>
          {isMenuOpen ? <Icon className="text-3xl" name="menu-opened" /> : <Icon className="text-4xl" name="menu" />}
        </button>
        <ul
          className={classNames("absolute top-full right-0 text-right py-3 md:static md:flex md:py-0", {
            hidden: !isMenuOpen && isMobile,
            "border bg-white": isMobile,
          })}
        >
          <li>
            <a
              id="nav-link-faq"
              className={linkClassNames}
              href={links.faq}
            >
              <span className="inline">FAQ</span>
            </a>
          </li>
          {
            isAuthenticated ? (
              <>
                <li>
                  <button className={`${linkClassNames} md:mb-0 uppercase`} type="button" onClick={showSupportModal}>
                    <span className="inline">Support</span>
                  </button>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }): string => (isActive ? activeLinkClassNames : linkClassNames)}
                    id="nav-link-wallets"
                    to={routes.wallets}
                  >
                    <span className="inline">Wallets</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }): string => (isActive ? activeLinkClassNames : linkClassNames)}
                    id="nav-link-settings"
                    to={routes.settings}
                  >
                    <span className="inline">Settings</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    className={`${linkClassNames} md:mb-0 uppercase`}
                    name="log-out"
                    onClick={signOut}
                  >
                    <span className="inline">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    id="nav-link-login"
                    className={({ isActive }): string => (isActive ? activeLinkClassNames : linkClassNames)}
                    to={routes.login}
                  >
                    <span className="inline">Login</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="nav-link-register"
                    className={({ isActive }): string => `${linkClassNames} ${isActive ? "font-bold theme-text-primary" : ""}`}
                    to={routes.register}
                  >
                    <span>Sign up</span>
                  </NavLink>
                </li>
              </>
            )
          }
        </ul>
      </nav>
    </header>
  );
};
