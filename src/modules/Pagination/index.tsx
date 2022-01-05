import React from "react";
import classNames from "classnames";

interface Props {
  loading: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  page: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({ onChange, page, loading, hasPreviousPage, hasNextPage }) => {
  return (
    <div className={classNames("flex justify-center space-x-3", { "opacity-50": loading })}>
      <button
        disabled={loading || !hasPreviousPage}
        className={classNames("text-primary", { "opacity-50 cursor-default": !hasPreviousPage })}
        onClick={(): void => { onChange(page - 1); }}
      >
        &#x3c; Prev
      </button>
      <span>{page}</span>
      <button
        disabled={loading || !hasNextPage}
        className={classNames("text-primary", { "opacity-50": !hasNextPage })}
        onClick={(): void => { onChange(page + 1); }}
      >
        Next &#x3e;
      </button>
    </div>
  )
}