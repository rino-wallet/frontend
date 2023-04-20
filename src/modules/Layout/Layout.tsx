import React, { useState } from "react";
import { LayoutAuth } from "./LayoutAuth";
import { LayoutDefault } from "./LayoutDefault";
import { LayoutClear } from "./LayoutClear";
import { LayoutMessage } from "./LayoutMessage";
import { LayoutPublicWallet } from "./LayoutPublicWallet";
import { BannerContainer } from "./Banner";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  page?: string;
}

export const Layout: React.FC<Props> = ({
  children, signOut, isAuthenticated, page,
}) => {
  const [toggleBanner, setToggleBanner] = useState(true);
  switch (page) {
    case "login":
    case "register":
    case "resendActivationEmail":
    case "resetPassword": {
      return (
        <div>
          <BannerContainer />
          <LayoutAuth signOut={signOut} isAuthenticated={isAuthenticated}>{children}</LayoutAuth>
        </div>
      );
    }
    case "404":
    case "maintenance":
    case "unsupported_browser": {
      return <LayoutMessage>{children}</LayoutMessage>;
    }
    case "keypair": {
      return (
        <div>
          <BannerContainer />
          <LayoutClear>{children}</LayoutClear>
        </div>
      );
    }
    case "publicWallet": {
      return (
        <div>
          <BannerContainer isPublic />
          <LayoutPublicWallet signOut={signOut} isAuthenticated={isAuthenticated}>{children}</LayoutPublicWallet>
        </div>
      );
    }
    default: {
      return (
        <div>
          <BannerContainer toggleBanner={toggleBanner} setToggleBanner={setToggleBanner} />
          <LayoutDefault toggleCSS={toggleBanner} signOut={signOut} isAuthenticated={isAuthenticated}>{children}</LayoutDefault>
        </div>
      );
    }
  }
};
