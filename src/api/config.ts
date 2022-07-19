export const apiConfig = {
  returnRejectedPromiseOnError: true,
  timeout: 60000,
  baseURL: `${process.env.REACT_APP_API || ""}/api/v1`,
};
