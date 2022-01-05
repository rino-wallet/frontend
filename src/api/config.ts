export const apiConfig = {
  returnRejectedPromiseOnError: true,
  timeout: 30000,
  baseURL: `${process.env.REACT_APP_API || ""}/api/v1`,
};
