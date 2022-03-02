import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import ROUTES from "../../router/routes";
import { Logo } from "../../components";
import { PreventAction } from "../PreventAction";
import routes from "../../router/routes";

const linkElementClassName = "md:ml-10 font-bold uppercase text-base md:text-lg";

interface Props {
  dark?: boolean;
  showDisclaimer?: boolean;
}

const Footer: React.FC<Props> = ({ dark, showDisclaimer }) => {
  const logoElement = dark ? <Logo white /> : <Logo />;
  return (
    <div className={classNames("px-5 pt-10 pb-6", { "text-white footer-dark": dark })}>
      <div
        className="container max-w-5xl m-auto" data-qa-selector="footer"
      >
        <div className="flex justify-between justify-self-end mb-3">
          <PreventAction content={logoElement}>
            <Link to={routes.home}>{logoElement}</Link>
          </PreventAction>
          <div className="md:py-3 md:block grid grid-cols-2 gap-4">
            <PreventAction className={linkElementClassName} content="Terms of Service"><Link className={linkElementClassName} to={ROUTES.terms_of_service}>Terms of service</Link></PreventAction>
            <PreventAction className={linkElementClassName} content="Privacy policy"><Link className={linkElementClassName} to={ROUTES.privacy_policy}>Privacy policy</Link></PreventAction>
            <PreventAction className={linkElementClassName} content="Cookie policy"><Link className={linkElementClassName} to={ROUTES.cookie_policy}>Cookie policy</Link></PreventAction>
            <PreventAction className={linkElementClassName} content="Security"><Link className={linkElementClassName} to={ROUTES.security}>Security</Link></PreventAction>
            <PreventAction className={linkElementClassName} content="FAQ"><Link className={linkElementClassName} to={ROUTES.faq}>FAQ</Link></PreventAction>
          </div>
        </div>
        <div className={classNames("flex justify-between justify-self-end text-sm", { "text-white": dark, "theme-text-secondary": !dark })}>
          <div className="">Copyright © 2021 RINO. All Rights Reserved.</div>
          <div className="text-right">
            <div className="ml-10 text-right text-sm inline">Contact via email: <a className="font-bold theme-text-primary" target="_blank" href="mailto:support@rino.io">support@rino.io</a></div>
            <div className="ml-10 text-right text-sm inline">Contact via Twitter: <a className="font-bold theme-text-primary" target="_blank" href="https://twitter.com/RINOwallet">@RINOwallet</a></div>
          </div>
        </div>
        {
          showDisclaimer && (
            <>
              <div className={classNames("flex text-xs theme-text-secondary mb-2 mt-6", { "text-white": dark, "theme-text-secondary": !dark })}>
                <p>
                  <span className="font-bold">Disclaimer: </span>RINO is a software platform ONLY and does not conduct any independent diligence on or substantive review of any blockchain asset, digital currency, cryptocurrency or associated funds. You are fully and solely responsible for evaluating your investments, for determining whether you will buy, sell or exchange blockchain assets.
              </p>
              </div>
              <div className={classNames("flex text-xs theme-text-secondary", { "text-white": dark, "theme-text-secondary": !dark })}>
                RINO DOES NOT HAVE ANY access to your wallet's funds whatsoever. This means that if you lose the password and the recovery documents, RINO has no way of restoring the access to your wallet. Your funds might then be lost forever.
               </div>
            </>
          )
        }
      </div>
    </div>
  );
}

export default Footer;