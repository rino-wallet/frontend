import React from "react";
import { Button, CopyIcon } from "../../components";
import { useCopy } from "../../hooks";

interface Props {
  value: string;
  qaSelector: string;
}

export const CopyArea: React.FC<Props> = ({ children, qaSelector, value }) => {
  const {successFlag, copyToClipboard} = useCopy();
  return (
    <div className="w-full font-lato inline-flex border-solid border theme-text px-6 py-3.75 text-lg rounded-medium theme-bg-control-disabled">
      <div className="w-full flex justify-between items-center space-x-3">
        <div className="min-w-0 break-words" data-qa-selector={qaSelector}>{children}</div>
        <div className="flex-shrink-0">
          <Button
            name={`${qaSelector}-btn`}
            size={Button.size.MEDIUM}
            variant={successFlag ? Button.variant.GREEN : Button.variant.GRAY}
            onClick={(): void => { copyToClipboard(value); }}
            icon
          >
            <CopyIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}