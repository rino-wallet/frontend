import React from "react";
import classNames from "classnames";
import { useTranslation, Trans } from "react-i18next";
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
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();
  const links = isEnterprise ? ROUTES.static.enterprise : ROUTES.static.consumer;
  const logoElement = dark ? <Logo white /> : <Logo />;
  const currentYear = new Date().getFullYear();
  return (
    <div className={classNames("px-5 pt-10 pb-6", { "text-white footer-dark": dark })}>
      <div
        className="container max-w-5xl m-auto"
        data-qa-selector="footer"
      >
        <div className="flex justify-between justify-self-end mb-5">
          <a href={isAuthenticated ? ROUTES.wallets : links.landing}>{logoElement}</a>
          <div className="md:py-3 md:block grid md:grid-cols-2 gap-4">
            <a className={linkElementClassName} href={links.terms_of_service}>{t("layout.terms.of.service")}</a>
            <a className={linkElementClassName} href={links.privacy_policy}>{t("layout.privacy.policy")}</a>
            <a className={linkElementClassName} href={links.cookie_policy}>{t("layout.cookie.policy")}</a>
            <a className={linkElementClassName} href={links.security}>{t("layout.security")}</a>
            <a className={linkElementClassName} href={links.faq}>{t("layout.faq")}</a>
          </div>
        </div>
        <div className={classNames("mb-6 flex flex-col w-full justify-end md:items-center md:flex-row", { "footer-dark__text": dark, "theme-text-secondary": !dark })}>
          <div className="text-right text-lg md:order-2 md:flex md:space-x-10">
            <div className={classNames({ "text-white": dark })}>
              {t("layout.contact.us.email")}
              {" "}
              <a className="font-bold theme-text-primary" target="_blank" href="mailto:support@rino.io" rel="noreferrer">support@rino.io</a>
            </div>
            <div className={classNames({ "text-white": dark })}>
              {t("layout.contact.us.twitter")}
              {" "}
              <a className="font-bold text-blue-500" target="_blank" href="https://twitter.com/RINOwallet" rel="noreferrer">@RINOwallet</a>
            </div>
            <div className={classNames({ "text-white": dark })}>
              {t("layout.follow.us.reddit")}
              {" "}
              <a className="font-bold theme-text-primary" target="_blank" href="https://www.reddit.com/user/RINOwallet/" rel="noreferrer">@RINOwallet</a>
            </div>
          </div>
        </div>
        <div className={classNames("text-lg md:flex justify-between md:order-1", { "footer-dark__text": dark, "theme-text-secondary": !dark })}>
          <Trans i18nKey="layout.copyright">
            {/* eslint-disable-next-line */}
            Copyright © 2022 - {{ currentYear }} RINO. All Rights Reserved.
          </Trans>
          <div>
            <a target="_blank" rel="noreferrer" href="https://integrity.rino.io/">https://integrity.rino.io/</a>
          </div>
        </div>
        {
          showDisclaimer && (
            <Trans i18nKey="layout.disclaimer">
              <div className={classNames("flex text-sm theme-text-secondary mb-2 mt-6", { "footer-dark__text": dark, "theme-text-secondary": !dark })}>
                <p>
                  <span className="font-bold">Disclaimer: </span>
                  RINO is a software platform ONLY and does not conduct any independent diligence on or substantive review of any blockchain asset, digital currency, cryptocurrency or associated funds. You are fully and solely responsible for evaluating your investments, for determining whether you will buy, sell or exchange blockchain assets.
                </p>
              </div>
              <div className={classNames("flex text-sm theme-text-secondary", { "footer-dark__text": dark, "theme-text-secondary": !dark })}>
                RINO DOES NOT HAVE ANY access to your wallet&apos;s funds whatsoever. This means that if you lose the password and the recovery documents, RINO has no way of restoring the access to your wallet. Your funds might then be lost forever.
              </div>
            </Trans>
          )
        }
      </div>
    </div>
  );
};

export default Footer;
