import React, { ReactElement } from "react";
import Loadable from "react-loadable";
import { RouteComponentProps } from "react-router-dom";
import { Loading } from "../components";
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

const defaultTitle = "Wallet";
const defaultDescription = "Pay the world with monero.";
const defaultMetaKeywords = "monero bitcoin xmr btc usdc euro";
const defaultMetaOgImage = "%PUBLIC_URL%/logo_with_text.jpg";
const env = process.env.REACT_APP_ENV;

type RouteType = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  metaOgImage: string;
  component: React.FC<RouteComponentProps<any>>;
  isPrivate?: boolean;
  exact: boolean;
  key: string;
}

const ROUTER_CONFIG: RouteType[] = [
  {
    path: ROUTES.emailConfirm,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ConfirmEmail {...props} />,
    exact: true,
    key: "emailConfirm",
  },
  {
    path: ROUTES.home,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Home {...props} />,
    exact: true,
    key: "home",
  },
  {
    path: ROUTES.login,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Login {...props} />,
    exact: true,
    key: "login",
  },
  {
    path: ROUTES.register,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Register {...props} />,
    exact: true,
    key: "register",
  },
  {
    path: ROUTES.resetPasswordRequest,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ResetPassword {...props} />,
    exact: true,
    key: "resetPasswordRequest",
  },
  {
    path: ROUTES.resetPasswordConfirm,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ResetPassword {...props} />,
    exact: true,
    key: "resetPasswordConfirm",
  },
  {
    path: ROUTES.keypair,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <GenerateKeyPair {...props} />,
    exact: true,
    isPrivate: true,
    key: "keypair",
  },
  {
    path: ROUTES.profile,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Profile {...props} />,
    exact: true,
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
    exact: true,
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
    exact: false,
    isPrivate: true,
    key: "new wallet",
  },
  {
    path: ROUTES.wallet,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <Wallet {...props} />,
    exact: false,
    isPrivate: true,
    key: "wallet details",
  },
  {
    path: ROUTES.changeEmail,
    metaTitle: defaultTitle,
    metaDescription: defaultDescription,
    metaKeywords: defaultMetaKeywords,
    metaOgImage: defaultMetaOgImage,
    component: (props: any): ReactElement => <ChangeEmailConfirm {...props} />,
    exact: true,
    isPrivate: true,
    key: "change email confirmation",
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
    exact: true,
    key: "components",
  });
}

export default ROUTER_CONFIG;
