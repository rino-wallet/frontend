import React, { useEffect } from "react";

interface Props {
  needConfirmation?: boolean;
}

export const BeforeUnloadConfirm: React.FC<Props> = ({ needConfirmation }) => {
  useEffect(() => {
    function handleOnBeforeUnload(e: BeforeUnloadEvent): void {
      e.preventDefault();
      e.returnValue = "";
    }
    if (needConfirmation) {
      window.addEventListener("beforeunload", handleOnBeforeUnload);
    }
    return (): void => {
      window.removeEventListener("beforeunload", handleOnBeforeUnload);
    };
  }, [needConfirmation]);
  return null;
};
