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
  // approver: {
  //   code: 30,
  //   title: "Approver",
  // },
  viewOnly: {
    code: 40,
    value: "View-only",
    title: "Viewer",
  },
};

export const transactionPriorities = {
  "Unimportant": "UNIMPORTANT",
  "Normal": "NORMAL",
  "Elevated": "ELEVATED",
  "Priority": "PRIORITY",
};


export const createNewWalletSteps = {
  wallet1: "Step 1/6: Creating user and backup keys locally in your browser",
  wallet2: "Step 2/6: Generating multisig info for your keys locally in your browser",
  wallet3: "Step 3/6: Creating the RINO key on the server",
  wallet4: "Step 4/6: Generating multisig info for the RINO key on the server",
  wallet5: "Step 5/6: Exchanging all multisig info between browser and server",
  wallet6: "Step 6/6: Finalizing your new wallet",
}

export const createTransactionSteps = {
  transaction1: "Step 1/5: Client-side decryption of user key",
  transaction2: "Step 2/5: Requesting unsigned transaction from RINO",
  transaction3: "Step 3/5: Client-side check of transaction",
  transaction4: "Step 4/5: Requesting second signature from RINO",
  transaction5: "Step 5/5: Submitting transaction to the Monero network",
}

export const browserFeatures: { webassembly: "webassembly" } = {
  webassembly: "webassembly",
}

export const PUBLIC_APP_URLS_MAP = {
  production: "https://rino.io",
  test: "https://test.rino.io",
  staging: "https://labradoodle.staging.rino.io",
  develop: "https://labradoodle.dev.rino.io",
}

export const APP_URLS_MAP = {
  production: "https://app.rino.io",
  test: "https://app.test.rino.io",
  staging: "https://appradoodle.staging.rino.io",
  develop: "https://proxy.dev.rino.io",
}
