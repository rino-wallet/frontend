export const defaultWalletPassword = "password";

export const asyncActionStatuses = {
  loading: "loading",
  succeeded: "succeeded",
  failed: "failed",
  idle: "idle",
};

// eslint-disable-next-line
export enum UI_SIZE {
  BIG,
  MEDIUM,
  SMALL,
}

export const UI_SIZE_MAP: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: "py-2.25 text-sm",
  [UI_SIZE.MEDIUM]: "py-1.25 text-sm",
  [UI_SIZE.SMALL]: "py-1 text-xs",
};

export const UI_ROUNDED_SIZE_MAPS: Record<UI_SIZE, string> = {
  [UI_SIZE.BIG]: "w-10 h-10",
  [UI_SIZE.MEDIUM]: "w-8 h-8",
  [UI_SIZE.SMALL]: "w-6 h-6",
};

export const accessLevels = {
  owner: {
    code: 10,
    title: "Owner",
  },
  admin: {
    code: 20,
    title: "Admin",
  },
  approver: {
    code: 30,
    title: "Approver",
  },
  readOnly: {
    code: 40,
    title: "Read-only",
  },
};

export const transactionPriorities = {
  "Unimportant": "UNIMPORTANT",
  "Normal": "NORMAL",
  "Elevated": "ELEVATED",
  "Priority": "PRIORITY",
};