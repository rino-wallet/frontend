import { useState } from "react";

const createFakeElementAndCopy = (str: string): void => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const defaultOptions = {
  successFlagDuration: 1000,
};

export function useCopy(
  params = {},
): {
    successFlag: boolean;
    copyToClipboard: (str: string) => void;
  } {
  const options = {
    ...defaultOptions,
    ...params,
  };
  const [successFlag, setSuccessFlag] = useState(false);
  function copyToClipboard(str: string): void {
    createFakeElementAndCopy(str);
    setSuccessFlag(true);
    setTimeout((): void => {
      setSuccessFlag(false);
    }, options.successFlagDuration);
  }
  return {
    successFlag,
    copyToClipboard,
  };
}
