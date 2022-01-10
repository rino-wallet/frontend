import React from "react";
import { useCopy } from "../../hooks/useCopy";
import { Icon } from "../Icon";
interface Props {
  value: string;
  id?: string;
}
const CopyToClipboard: React.FC<Props> = ({
  value = "",
  id = "",
  children,
}) => {
  const { successFlag, copyToClipboard } = useCopy();
  function clickHandler(): void {
    copyToClipboard(value);
  }
  return (
    <>
      {children || value}
      <button
        {...(id ? { id } : {})}
        type="button"
        className="copy-content clear-btn c-hand"
        onClick={clickHandler}
      >
        <div className="copy-content__icon ml-2 text-sm">
          {successFlag ?
            <Icon name="check" className="theme-text-success" />
            :
            <Icon name="copy" className="theme-text-secondary" />
          }
        </div>
      </button>
    </>
  );
};

export default CopyToClipboard;
