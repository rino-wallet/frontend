import React, { ReactElement } from "react";
import Loadable from "react-loadable";
import { Loading } from "../components";
import { browserFeatures } from "../constants";
import ROUTES from "./routes";

const ConfirmEmail = Loadable({
  loader: () => import("../pages/ConfirmEmail" /* webpackChunkName: "ConfirmEmail" */),
  loading: Loading,
});
const Home = Loadable({
  loader: () => import("../pages/Home" /* webpackChunkName: "Home" */),
  loading: Loading,
});
const Login = Loadable({
  loader: () => import("../pages/Login" /* webpackChunkName: "Login" */),
  loading: Loading,
});
const Register = Loadable({
  loader: () => import("../pages/Register" /* webpackChunkName: "Register" */),
  loading: Loading,
});
const ResetPassword = Loadable({
  loader: () => import("../pages/ResetPassword" /* webpackChunkName: "ResetPassword" */),
  loading: Loading,
});
const Profile = Loadable({
  loader: () => import("../pages/Profile" /* webpackChunkName: "Profile" */),
  loading: Loading,
});
const Wallets = Loadable({
  loader: () => import("../pages/Wallets" /* webpackChunkName: "Wallets" */),
  loading: Loading,
});
const NewWallet = Loadable({
  loader: () => import("../pages/NewWallet" /* webpackChunkName: "NewWallet" */),
  loading: Loading,
});
const Wallet = Loadable({
  loader: () => import("../pages/Wallet" /* webpackChunkName: "Wallet" */),
  loading: Loading,
});
const ChangeEmailConfirm = Loadable({
  loader: () => import("../pages/ChangeEmailConfirm" /* webpackChunkName: "ChangeEmailConfirm" */),
  loading: Loading,
});
const Components = Loadable({
  loader: () => import("../pages/Components" /* webpackChunkName: "Components" */),
  loading: Loading,
});
const GenerateKeyPair = Loadable({
  loader: () => import("../pages/GenerateKeyPair" /* webpackChunkName: "GenerateKeyPair" */),
  loading: Loading,
});
const Security = Loadable({
  loader: () => import("../pages/Security" /* webpackChunkName: "Security" */),
  loading: Loading,
});
const Acknowledgments = Loadable({
  loader: () => import("../pages/Acknowledgments" /* webpackChunkName: "Acknowledgments" */),
  loading: Loading,
});
const SecurityPGPKey = Loadable({
  loader: () => import("../pages/SecurityPGPKey" /* webpackChunkName: "SecurityPGPKey" */),
  loading: Loading,
});

const FAQ = Loadable({
  loader: () => import("../pages/FAQ" /* webpackChunkName: "FAQ" */),
  loading: Loading,
});

const TermsOfService = Loadable({
  loader: () => import("../pages/TermsOfService" /* webpackChunkName: "TermsOfService" */),
  loading: Loading,
});

const PrivacyPolicy = Loadable({
  loader: () => import("../pages/PrivacyPolicy" /* webpackChunkName: "PrivacyPolicy" */),
  loading: Loading,
});

const CookiePolicy = Loadable({
  loader: () => import("../pages/CookiePolicy" /* webpackChunkName: "CookiePolicy" */),
  loading: Loading,
});

const NotFound = Loadable({
  loader: () => import("../pages/NotFound" /* webpackChunkName: "NotFound" */),
  loading: Loading,
});

const defaultTitle = "RINO - Enterprise-Grade Monero Wallet";
const defaultDescription = "RINO is a new type of Monero wallet. We are a non-custodial, enterprise-grade, multisig wallet.";
const defaultMetaKeywords = "RINO, Monero, Wallet, Enterprise-Grade, Multisig, Convenient, Secure, Non-custodial";
const defaultMetaOgImage = "https://rino.io/meta-image.png";
const env = process.env.REACT_APP_ENV;

type RequiredFeatures = "webassembly";

type RouteType = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  metaOgImage: string;
  component: React.FC;
  isPrivate?: boolean;
  key: string;
  requiredFeatures?: RequiredFeatures[];
}

const ROUTER_CONFIG: RouteType[] = [
  {
    path: ROUTES.emailConfirm,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ConfirmEmail {...props} />,
    key: "emailConfirm",
  },
  {
    path: ROUTES.home,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Home {...props} />,
    key: "landing",
  },
  {
    path: ROUTES.login,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Login {...props} />,
    key: "login",
    requiredFeatures: [browserFeatures.webassembly],
  },
  {
    path: ROUTES.register,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Register {...props} />,
    key: "register",
    requiredFeatures: [browserFeatures.webassembly],
  },
  {
    path: ROUTES.resetPassword,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ResetPassword {...props} />,
    key: "resetPassword",
    requiredFeatures: [browserFeatures.webassembly],
  },
  {
    path: ROUTES.keypair,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <GenerateKeyPair {...props} />,
    isPrivate: true,
    key: "keypair",
    requiredFeatures: [browserFeatures.webassembly],
  },
  {
    path: ROUTES.profile,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Profile {...props} />,
    isPrivate: true,
    key: "profile",
  },
  {
    path: ROUTES.wallets,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Wallets {...props} />,
    isPrivate: true,
    key: "wallets",
  },
  {
    path: ROUTES.newWallet,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <NewWallet {...props} />,
    isPrivate: true,
    key: "new wallet",
    requiredFeatures: [browserFeatures.webassembly],
  },
  {
    path: ROUTES.wallet,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Wallet {...props} />,
    isPrivate: true,
    key: "wallet details",
    requiredFeatures: [browserFeatures.webassembly],
  },
  {
    path: ROUTES.changeEmail,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ChangeEmailConfirm {...props} />,
    isPrivate: true,
    key: "change email confirmation",
  },
  {
    path: ROUTES.security,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Security {...props} />,
    isPrivate: false,
    key: "security",
  },
  {
    path: ROUTES.acknowledgments,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Acknowledgments {...props} />,
    isPrivate: false,
    key: "acknowledgments",
  },
  {
    path: ROUTES.security_pgp_key,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <SecurityPGPKey {...props} />,
    isPrivate: false,
    key: "security_pgp_key",
  },
  {
    path: ROUTES.faq,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <FAQ {...props} />,
    isPrivate: false,
    key: "faq",
  },
  {
    path: ROUTES.terms_of_service,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <TermsOfService {...props} />,
    isPrivate: false,
    key: "terms_of_service",
  },
  {
    path: ROUTES.privacy_policy,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <PrivacyPolicy {...props} />,
    isPrivate: false,
    key: "privacy_policy",
  },
  {
    path: ROUTES.cookie_policy,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <CookiePolicy {...props} />,
    isPrivate: false,
    key: "cookie_policy",
  },
  {
    path: ROUTES.not_found,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <NotFound {...props} />,
    isPrivate: false,
    key: "404",
  },
];

// list of ui componenst
if (env === "develop") {
  ROUTER_CONFIG.push({
    path: ROUTES.components,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Components {...props} />,
    key: "components",
  });
}

export default ROUTER_CONFIG;
