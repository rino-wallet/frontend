import React from "react";
import classNames from "classnames";
import ROUTES from "../../router/routes";
import { Logo } from "../../components";
import { useAccountType } from "../../hooks";

const linkElementClassName = "md:ml-10 font-bold uppercase text-base md:text-lg text-right";

interface Props {
  dark?: boolean;
  showDisclaimer?: boolean;
  isAuthenticated: boolean;
}

const Footer: React.FC<Props> = ({ dark, showDisclaimer, isAuthenticated }) => {
  const { isEnterprise } = useAccountType();
  const links = isEnterprise ? ROUTES.static.enterprise : ROUTES.static.consumer;
  const logoElement = dark ? <Logo white /> : <Logo />;
  return (
    <div className={classNames("px-5 pt-10 pb-6", { "text-white footer-dark": dark })}>
      <div
        className="container max-w-5xl m-auto"
        data-qa-selector="footer"
      >
        <div className="flex justify-between justify-self-end mb-5">
          <a href={isAuthenticated ? ROUTES.wallets : links.landing}>{logoElement}</a>
          <div className="md:py-3 md:block grid md:grid-cols-2 gap-4">
            <a className={linkElementClassName} href={links.terms_of_service}>Terms of service</a>
            <a className={linkElementClassName} href={links.privacy_policy}>Privacy policy</a>
            <a className={linkElementClassName} href={links.cookie_policy}>Cookie policy</a>
            <a className={linkElementClassName} href={links.security}>Security</a>
            <a className={linkElementClassName} href={links.faq}>FAQ</a>
          </div>
        </div>
        <div className={classNames("flex flex-col w-full justify-end md:items-center md:justify-between md:flex-row", { "footer-dark__text": dark, "theme-text-secondary": !dark })}>
          <div className="text-right text-lg md:order-2 md:flex md:space-x-10">
            <div className={classNames({ "text-white": dark })}>
              Contact us via email:
              {" "}
              <a className="font-bold theme-text-primary" target="_blank" href="mailto:support@rino.io" rel="noreferrer">support@rino.io</a>
            </div>
            <div className={classNames({ "text-white": dark })}>
              Contact us via Twitter:
              {" "}
              <a className="font-bold text-blue-500" target="_blank" href="https://twitter.com/RINOwallet" rel="noreferrer">@RINOwallet</a>
            </div>
          </div>
          <div className="text-sm mt-5 md:mt-0 md:order-1">Copyright © 2022 RINO. All Rights Reserved.</div>
        </div>
        {
          showDisclaimer && (
            <>
              <div className={classNames("flex text-sm theme-text-secondary mb-2 mt-6", { "footer-dark__text": dark, "theme-text-secondary": !dark })}>
                <p>
                  <span className="font-bold">Disclaimer: </span>
                  RINO is a software platform ONLY and does not conduct any independent diligence on or substantive review of any blockchain asset, digital currency, cryptocurrency or associated funds. You are fully and solely responsible for evaluating your investments, for determining whether you will buy, sell or exchange blockchain assets.
                </p>
              </div>
              <div className={classNames("flex text-sm theme-text-secondary", { "footer-dark__text": dark, "theme-text-secondary": !dark })}>
                RINO DOES NOT HAVE ANY access to your wallet&apos;s funds whatsoever. This means that if you lose the password and the recovery documents, RINO has no way of restoring the access to your wallet. Your funds might then be lost forever.
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default Footer;
