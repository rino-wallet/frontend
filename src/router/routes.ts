import { PUBLIC_APP_URLS_MAP } from "../constants";
import { ReactAppEnv } from "../types";

const publicUrl = PUBLIC_APP_URLS_MAP[process.env.REACT_APP_ENV as ReactAppEnv];

export default {
  login: "/login",
  register: "/register",
  emailConfirm: "/accounts/activation/:userId/:token",
  resetPassword: "/accounts/password/*",
  resendActivationEmail: "/accounts/resend_activation/",
  settings: "/settings",
  wallets: "/wallets",
  acceptWalletShare: "wallets/:walletId/accept-share/:shareId/",
  wallet: "/wallets/:id/*",
  publicWallet: "/public/wallets/:id/*",
  newWallet: "/new-wallet",
  changeEmail: "/change-email/:token",
  components: "/components",
  keypair: "/keypair",
  not_found: "/404",
  logout: "/logout",
  security: `${publicUrl}/security`,
  acknowledgments: `${publicUrl}/acknowledgments`,
  security_pgp_key: `${publicUrl}/security-pgp-key`,
  terms_of_service: `${publicUrl}/terms-of-service`,
  privacy_policy: `${publicUrl}/privacy-policy`,
  cookie_policy: `${publicUrl}/cookie-policy`,
  faq: `${publicUrl}/faq`,
  community: "https://community.rino.io",
};
