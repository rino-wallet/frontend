export function generateListReqParams(page: number, itemsPerPage: number): { offset: number; limit: number } {
  if (page < 1) {
    throw new Error("page should be greater than 0");
  }
  if (page % 1 > 0) {
    throw new Error("page can't be float");
  }
  if (itemsPerPage < 1) {
    throw new Error("itemsPerPage should be greater than 0");
  }
  if (itemsPerPage % 1 > 0) {
    throw new Error("itemsPerPage can't be float");
  }
  return {
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
  };
}
