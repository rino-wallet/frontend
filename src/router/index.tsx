import React, { ReactElement } from "react";
import Loadable from "react-loadable";
import { Loading } from "../components";
import { browserFeatures } from "../constants";
import ROUTES from "./routes";

const ConfirmEmail = Loadable({
  loader: () => import("../pages/ConfirmEmail" /* webpackChunkName: "ConfirmEmail" */),
  loading: Loading,
});

const AcceptWalletShare = Loadable({
  loader: () => import("../pages/AcceptWalletShare" /* webpackChunkName: "NotFound" */),
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
const Settings = Loadable({
  loader: () => import("../pages/Settings" /* webpackChunkName: "Settings" */),
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
const PublicWallet = Loadable({
  loader: () => import("../pages/Wallet/PublicWallet" /* webpackChunkName: "PublicWallet" */),
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

const NotFound = Loadable({
  loader: () => import("../pages/NotFound" /* webpackChunkName: "NotFound" */),
  loading: Loading,
});

const ResendActivationEmail = Loadable({
  loader: () => import("../pages/ResendActivationEmail" /* webpackChunkName: "ResendActivationEmail" */),
  loading: Loading,
});

const Logout = Loadable({
  loader: () => import("../pages/Logout" /* webpackChunkName: "Logout" */),
  loading: Loading,
});

const Maintenance = Loadable({
  loader: () => import("../pages/Maintenance" /* webpackChunkName: "Maintenance" */),
  loading: Loading,
});

const Rewards = Loadable({
  loader: () => import("../pages/Rewards" /* webpackChunkName: "Rewards" */),
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
};

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
    path: ROUTES.resendActivationEmail,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ResendActivationEmail {...props} />,
    key: "resendActivationEmail",
    requiredFeatures: [],
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
    path: ROUTES.settings,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Settings {...props} />,
    isPrivate: true,
    key: "settings",
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
    path: ROUTES.acceptWalletShare,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <AcceptWalletShare {...props} />,
    isPrivate: false,
    key: "acceptWalletShare",
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
    path: ROUTES.rewards,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Rewards {...props} />,
    isPrivate: true,
    key: "rewards",
  },
  {
    path: ROUTES.publicWallet,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <PublicWallet {...props} />,
    isPrivate: false,
    key: "publicWallet",
    requiredFeatures: [],
  },
  {
    path: ROUTES.changeEmail,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ChangeEmailConfirm {...props} />,
    isPrivate: false,
    key: "change email confirmation",
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
  {
    path: ROUTES.logout,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Logout {...props} />,
    isPrivate: false,
    key: "logout",
  },
  {
    path: ROUTES.maintenance,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Maintenance {...props} />,
    isPrivate: false,
    key: "maintenance",
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
