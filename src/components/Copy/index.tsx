import React from "react";
import { useCopy } from "../../hooks/useCopy";

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
        <div className="copy-content__icon">
          {successFlag ? <span className="ml-2 text-secondary">&#10003;</span> : <svg fill="rgba(113, 113, 122)" className="ml-2" height="14px" viewBox="-40 0 512 512" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="m271 512h-191c-44.113281 0-80-35.886719-80-80v-271c0-44.113281 35.886719-80 80-80h191c44.113281 0 80 35.886719 80 80v271c0 44.113281-35.886719 80-80 80zm-191-391c-22.054688 0-40 17.945312-40 40v271c0 22.054688 17.945312 40 40 40h191c22.054688 0 40-17.945312 40-40v-271c0-22.054688-17.945312-40-40-40zm351 261v-302c0-44.113281-35.886719-80-80-80h-222c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20h222c22.054688 0 40 17.945312 40 40v302c0 11.046875 8.953125 20 20 20s20-8.953125 20-20zm0 0"/></svg>}
        </div>
      </button>
    </>
  );
};

export default CopyToClipboard;
