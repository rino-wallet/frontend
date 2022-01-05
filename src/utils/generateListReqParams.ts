export function generateListReqParams(page: number, itemsPerPage: number): { offset: number; limit: number } {
  return {
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
  }
}
