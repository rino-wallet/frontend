export const asyncActionStatuses = {
  loading: "loading",
  succeeded: "succeeded",
  failed: "failed",
  idle: "idle",
};

export const accessLevels = {
  owner: {
    code: 10,
    value: "Owner",
    title: "Owner",
  },
  admin: {
    code: 20,
    value: "Admin",
    title: "Admin",
  },
  spender: {
    code: 30,
    value: "Spender",
    title: "Spender",
  },
  approver: {
    code: 35,
    value: "Approver",
    title: "Approver",
  },
  viewOnly: {
    code: 40,
    value: "View-only",
    title: "Viewer",
  },
};

export const orderStatuses = {
  PENDING_PAYMENT: "Pending Payment",
  PENDING_EXECUTION: "Pending Execution",
  COMPLETE: "Complete",
  FAILED: "Failed",
  CANCELED: "Canceled",
};

export const accountType = {
  CONSUMER: "consumer",
  ENTERPRISE: "enterprise",
  PROSUMER: "prosumer",
};

export const transactionPriorities = {
  Unimportant: "UNIMPORTANT",
  Normal: "NORMAL",
  Elevated: "ELEVATED",
  Priority: "PRIORITY",
};

export const createNewWalletSteps = {
  wallet1: "new.wallet.form.step1",
  wallet2: "new.wallet.form.step2",
  wallet3: "new.wallet.form.step3",
  wallet4: "new.wallet.form.step4",
  wallet5: "new.wallet.form.step5",
  wallet6: "new.wallet.form.step6",
};

export const createTransactionSteps = {
  transaction1: "wallet.send.step1",
  transaction2: "wallet.send.step2",
  transaction3: "wallet.send.step4",
  transaction4: "wallet.send.step4",
  transaction5: "wallet.send.step5",
};

export const browserFeatures: { webassembly: "webassembly" } = {
  webassembly: "webassembly",
};

export const PUBLIC_APP_URLS_MAP = {
  production: "https://rino.io",
  test: "https://test.rino.io",
  staging: "https://labradoodle.staging.rino.io",
  develop: "https://labradoodle.dev.rino.io",
};

export const PUBLIC_ENTERPRISE_APP_URLS_MAP = {
  production: "https://enterprise.rino.io",
  test: "https://enterprise.test.rino.io/",
  staging: "https://enterprisedoodle.staging.rino.io",
  develop: "https://enterprisedoodle.dev.rino.io",
};

export const APP_URLS_MAP = {
  production: "https://app.rino.io",
  test: "https://app.test.rino.io",
  staging: "https://appradoodle.staging.rino.io",
  develop: "https://proxy.dev.rino.io",
};

export const PROMOTION_STATUS = {
  PENDING: "pending",
  READY: "ready",
  PAID: "paid",
};

export const conversionMapping = {
  btc: "1e8",
  xmr: "1e12",
  eth: "1e18",
  sol: "1e9",
  ada: "1e6",
  usdt: "1",
  usdc: "1e6",
  bnb: "1e18",
  xrp: "1e6",
  doge: "1e8",
  dot: "1e10",
};

export enum TRANSACTION_STATUS_CODE {
  PENDING = 10,
  CANCELED = 20,
  REJECTED = 30,
  COMPLETED = 50,
}
