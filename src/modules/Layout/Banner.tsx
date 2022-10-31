import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components";
import { useAccountType } from "../../hooks";
import ROUTES from "../../router/routes";

interface Props {
  children: ReactNode;
  action?: {
    title: string;
    link?: string;
    callback?: () => void;
  }
}

export const Banner: React.FC<Props> = ({ children, action }) => (
  <div className="bg-white theme-border border border-x-0 border-t-0 p-5">
    <div className="container m-auto md:max-w-screen-md lg:max-w-screen-lg justify-center flex items-start space-x-5">
      <div className="s">
        {children}
      </div>
      {
        action?.link && (
          <Link
            className="shrink-0"
            id="nav-link-register"
            to={action.link}
          >
            <Button variant={Button.variant.PRIMARY_LIGHT}>{action.title}</Button>
          </Link>
        )
      }
      {
        action?.callback && (
          <Button className="shrink-0" onClick={action?.callback} variant={Button.variant.PRIMARY_LIGHT}>{action.title}</Button>
        )
      }
    </div>
  </div>
);

export const BannerContainer: React.FC<{
  isPublic?: boolean;
}> = ({ isPublic }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [isCookiesAccepted, setIsCookiesAccepted] = useState(JSON.parse(localStorage.getItem("isCookiesAccepted") || "false"));
  const { isEnterprise, isConsumer, isAuthenticated } = useAccountType();
  const links = isEnterprise ? ROUTES.static.enterprise : ROUTES.static.consumer;
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
          <p>
            We use cookies to run our website and offer you the best possible user experience . We share certain information about your use of our website with our social media and analytics partners.  For more information on the data being collected and how it is shared with our partners, please read our
            {" "}
            <a className="theme-link" href={links.privacy_policy}>Privacy policy</a>
            {" "}
            and
            {" "}
            <a className="theme-link" href={links.cookie_policy}>Cookie policy</a>
            .
          </p>
        </div>
      </Banner>
    );
  }
  if (isConsumer && !isPublic && showBanner) {
    return (
      <Banner>
        <div className="text-center">
          <p>You are using the free version of RINO. If you are a business, you might be interested in our enterprise offering.</p>
          <a
            className="theme-text-primary"
            target="_blank"
            rel="noreferrer"
            href={ROUTES.static.enterprise.landing}
          >
            Click here to learn more.
          </a>
        </div>
      </Banner>
    );
  }
  if (!isAuthenticated && isPublic && showBanner) {
    return (
      <Banner action={{ title: "Sign up", link: ROUTES.register }}>
        <div className="text-right md:ml-32">
          <p>
            The owner of this wallet decided to enable and share a read-only view of all activities in real time, a free feature that comes with all RINO wallets. Sign up and give it a try!
          </p>
        </div>
      </Banner>
    );
  }
  return null;
};
