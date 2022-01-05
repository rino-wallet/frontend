import React from "react";
import { LayoutLanding } from "./LayoutLanding";
import { LayoutStatic } from "./LayoutStatic";
import { LayoutAuth } from "./LayoutAuth";
import { LayoutDefault } from "./LayoutDefault";
import { LayoutClear } from "./LayoutClear";

interface Props {
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  page?: string;
}

export const Layout: React.FC<Props> = ({ children, signOut, isAuthenticated, page }) => {
  switch (page) {
    case "landing": {
      return <LayoutLanding signOut={signOut} isAuthenticated={isAuthenticated}>{children}</LayoutLanding>
    }
    case "cookie_policy":
    case "privacy_policy":
    case "terms_of_service":
    case "security":
    case "security_pgp_key":
    case "acknowledgments":
    case "faq": {
      return <LayoutStatic signOut={signOut} isAuthenticated={isAuthenticated}>{children}</LayoutStatic>
    }
    case "login":
    case "register":
    case "resetPassword": {
      return <LayoutAuth signOut={signOut} isAuthenticated={isAuthenticated}>{children}</LayoutAuth>
    }
    case "keypair": {
      return <LayoutClear>{children}</LayoutClear>
    }
    default: {
      return <LayoutDefault signOut={signOut} isAuthenticated={isAuthenticated}>{children}</LayoutDefault>
    }
  }
}
