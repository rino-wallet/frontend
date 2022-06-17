import React from "react";
import classNames from "classnames";
import { Button } from "../../components/Button";

interface Props {
  loading: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}
type MyArray = [...(number | null)[]];

const paginationSlots = 7;

export const Pagination: React.FC<Props> = ({
  onChange, page, pageCount, loading, hasPreviousPage, hasNextPage,
}) => {
  const getLeftPageNumbers = (pageNumber: number, pagesCount: number): MyArray => {
    const placesForLeft = paginationSlots - Math.min(3, pagesCount - pageNumber) - 1;
    if (pageNumber <= 4) {
      return [...Array.from(new Array(pageNumber - 1), (x, i) => i + 1)];
    }
    if (pageNumber > placesForLeft) {
      return [1, null, ...Array.from(new Array(placesForLeft - 2), (x, i) => pageNumber - (placesForLeft - 2) + i)];
    }
    return [...Array.from(new Array(pageNumber), (x, i) => i + 1)];

    return [];
  };
  const getRightPageNumbers = (pageNumber: number, pagesCount: number): MyArray => {
    const placesForRight = paginationSlots - Math.min(3, pageNumber - 1) - 1;
    if (pageNumber + 4 > pagesCount) {
      return [...Array.from(new Array(pagesCount - pageNumber), (x, i) => pageNumber + 1 + i)];
    }

    if (pagesCount - pageNumber > 3) {
      if (pageNumber + 3 < pagesCount) {
        return [...Array.from(new Array(placesForRight - 2), (x, i) => pageNumber + i + 1), null, pagesCount];
      }
      return [...Array.from(new Array(pagesCount - pageNumber), (x, i) => i + pageNumber + 2)];
    }
    return [];
  };

  return (
    <div className={classNames("flex justify-center py-5", { "opacity-50": loading })}>
      <div className="inline-flex justify-center theme-bg-panel rounded-big">
        <Button
          disabled={loading || !hasPreviousPage}
          size={Button.size.BIG}
          className={classNames("theme-text z-10", { "opacity-50 cursor-default": !hasPreviousPage })}
          onClick={(): void => { onChange(page - 1); }}
          name="pagination-back"
          icon
        >
          ←
        </Button>
        <div
          className="flex items-center border-solid border z-0 theme-border border-r-0 border-l-0 py-3.75 px-9 -mx-7"
        >
          {Array.from(
            pageCount > paginationSlots
              ? [...getLeftPageNumbers(page, pageCount), page, ...getRightPageNumbers(page, pageCount)]
              : [...Array.from(new Array(pageCount), (x, i) => i + 1)],
          ).map((p) => (
            <button
              type="button"
              key={p}
              className={classNames("px-2 text-center w-8 inline-block", { "theme-text-primary font-bold": p === page, "hover:font-bold hover:cursor-pointer": p })}
              onClick={(): void => { if (p) onChange(p); }}
            >
              {p || "..."}
            </button>
          ))}
        </div>

        <Button
          disabled={loading || !hasNextPage}
          size={Button.size.BIG}
          className={classNames("theme-text z-10", { "opacity-50 cursor-default": !hasNextPage })}
          onClick={(): void => { onChange(page + 1); }}
          name="pagination-next"
          icon
        >
          →
        </Button>
      </div>
    </div>
  );
};
