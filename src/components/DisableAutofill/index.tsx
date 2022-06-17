import React from "react";

// We use tis component to disable keychain/password manager
// on fields that not need to be autofilled.
export const DisableAutofill: React.FC = () => (
  <div className="w-0 h-0 overflow-hidden">
    <input type="text" name="fake_safari_username" />
    <input type="password" name="fake_safari_password" />
  </div>
);
