import { PUBLIC_APP_URLS_MAP, PUBLIC_ENTERPRISE_APP_URLS_MAP } from "../constants";
import { ReactAppEnv } from "../types";

const publicUrl = PUBLIC_APP_URLS_MAP[process.env.REACT_APP_ENV as ReactAppEnv];
const entPublicUrl = PUBLIC_ENTERPRISE_APP_URLS_MAP[process.env.REACT_APP_ENV as ReactAppEnv];

export default {
  maintenance: "/maintenance",
  login: "/login",
  register: "/register",
  emailConfirm: "/accounts/activation/:userId/:token",
  resetPassword: "/accounts/password/*",
  resendActivationEmail: "/accounts/resend_activation/",
  settings: "/settings",
  accountActivity: "/settings/activity",
  wallets: "/wallets",
  acceptWalletShare: "wallets/:walletId/accept-share/:shareId/",
  wallet: "/wallets/:id/*",
  walletSettings: "/wallets/:id/settings",
  walletActivity: "/wallets/:id/settings/activity",
  publicWallet: "/public/wallets/:id/*",
  newWallet: "/new-wallet",
  changeEmail: "/change-email/:token",
  components: "/components",
  keypair: "/keypair",
  not_found: "/404",
  logout: "/logout",
  rewards: "/rewards/:type",
  static: {
    consumer: {
      security: `${publicUrl}/security`,
      acknowledgments: `${publicUrl}/acknowledgments`,
      security_pgp_key: `${publicUrl}/security-pgp-key`,
      terms_of_service: `${publicUrl}/terms-of-service`,
      privacy_policy: `${publicUrl}/privacy-policy`,
      cookie_policy: `${publicUrl}/cookie-policy`,
      faq: `${publicUrl}/faq`,
      landing: publicUrl,
    },
    enterprise: {
      security: `${entPublicUrl}/security`,
      acknowledgments: `${entPublicUrl}/acknowledgments`,
      security_pgp_key: `${entPublicUrl}/security-pgp-key`,
      terms_of_service: `${entPublicUrl}/terms-of-service`,
      privacy_policy: `${entPublicUrl}/privacy-policy`,
      cookie_policy: `${entPublicUrl}/cookie-policy`,
      faq: `${entPublicUrl}/faq`,
      landing: entPublicUrl,
    },
  },
  community: "https://community.rino.io",
};
