import React, {
  ReactNode, useEffect, useState,
} from "react";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { Button, Icon } from "../../components";
import { useAccountType } from "../../hooks";
import ROUTES from "../../router/routes";
import enterpriseThumbnail from "./enterprise-thumbnail.svg";

interface Props {
  children: ReactNode;
  action?: {
    title?: string;
    link?: string;
    callback?: () => void;
    closeBanner?: () => void;
  },
  className?: string;
}

export const Banner: React.FC<Props> = ({ children, action, className }) => {
  const { isEnterprise } = useAccountType();

  return (
    <div className={`bg-white theme-border border border-x-0 border-t-0 p-5 ${className}`}>
      <div className="container m-auto md:max-w-screen-md lg:max-w-screen-lg justify-center flex items-center space-x-5">
        <div className={`s ${className ? "w-full lg:w-3/4" : ""}`}>
          {children}
        </div>
        {
          action?.link && (
            <Link
              className="shrink-0"
              id="nav-link-register"
              to={action.link}
            >
              <Button
                variant={
                  isEnterprise
                    ? Button.variant.ENTERPRISE_LIGHT
                    : Button.variant.PRIMARY_LIGHT
                }
              >
                {action.title}
              </Button>
            </Link>
          )
        }
        {
          action?.callback && (
            <Button
              className="shrink-0"
              onClick={action?.callback}
              variant={
                isEnterprise
                  ? Button.variant.ENTERPRISE_LIGHT
                  : Button.variant.PRIMARY_LIGHT
              }
            >
                {action.title}
            </Button>
          )
        }
        {
          action?.closeBanner && (
            <Button onClick={action?.closeBanner} className="border-none" icon>
              <Icon name="cross" />
            </Button>
          )
        }
      </div>
    </div>
  );
};

export const BannerContainer: React.FC<{
  isPublic?: boolean;
  toggleBanner?: boolean;
  setToggleBanner?: (value: boolean) => void;
}> = ({ isPublic, toggleBanner, setToggleBanner }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [isCookiesAccepted, setIsCookiesAccepted] = useState(JSON.parse(localStorage.getItem("isCookiesAccepted") || "false"));
  const { isEnterprise, isConsumer, isAuthenticated } = useAccountType();
  const links = isEnterprise ? ROUTES.static.enterprise : ROUTES.static.consumer;

  const handleClick = () => {
    if (setToggleBanner) {
      setToggleBanner(!toggleBanner);
      setShowBanner(false);
    }
  };

  useEffect(() => {
    if (isConsumer && isAuthenticated) {
      if (setToggleBanner){
        setToggleBanner(true);
      }
      setShowBanner(true);
    } else if (setToggleBanner){
      setToggleBanner(false);
    }
  }, [isConsumer, isAuthenticated]);

  if (!isCookiesAccepted && showBanner) {
    return (
      <Banner
        action={{
          title: "OK",
          callback: () => {
            setIsCookiesAccepted(true);
            setShowBanner(false);
            localStorage.setItem("isCookiesAccepted", "true");
          },
        }}
      >
        <div className="text-left">
          <Trans i18nKey="layout.banner.cookies">
            We use cookies to run our website and offer you the best possible user experience . We share certain information about your use of our website with our social media and analytics partners.  For more information on the data being collected and how it is shared with our partners, please read our
            {" "}
            <a className="theme-link" href={links.privacy_policy}>Privacy policy</a>
            {" "}
            and
            {" "}
            <a className="theme-link" href={links.cookie_policy}>Cookie policy</a>
            .
          </Trans>
        </div>
      </Banner>
    );
  }
  if (isConsumer && showBanner) {
    return (
      <Banner
        action={{
          closeBanner: () => {
            handleClick();
          },
        }}
        className="fixed bottom-0 left-0 right-0 z-50 w-full"
      >
        <div className="relative flex gap-4 items-center">
          <img className="absolute -bottom-5 hidden md:block" src={enterpriseThumbnail} alt="" />
          <div className="ml-0 md:ml-64">
            <p className="font-bold text-xl">{t("layout.RINO.Enterprise")}</p>
            <p>{t("layout.banner.free")}</p>
          </div>
          <a className="shrink-0" href={ROUTES.static.enterprise.landing}>
            <Button variant={Button.variant.PRIMARY_LIGHT}>{t("layout.learn.more")}</Button>
          </a>
        </div>
      </Banner>
    );
  }
  if (!isAuthenticated && isPublic && showBanner) {
    return (
      <Banner action={{ title: "Sign up", link: ROUTES.register }}>
        <Trans i18nKey="layout.banner.reedonly" className="text-right md:ml-32">
          The owner of this wallet decided to enable and share a read-only view of all activities in real time, a free feature that comes with all RINO wallets. Sign up and give it a try!
        </Trans>
      </Banner>
    );
  }
  return null;
};
