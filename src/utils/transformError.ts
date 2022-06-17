import { ApiError, ApiErrorRaw } from "../types";

function isObject(o: unknown): boolean {
  return o instanceof Object && o.constructor === Object;
}

/**
 * Converts error object to the format that can be used by Formik
 * @param {object} error - API error object
 * @returns {object} formatted error object
 */
const transformError = (error: ApiErrorRaw): ApiError => {
  let out: { [key: string]: string } = {};
  Object.keys(error).forEach((key) => {
    if (Array.isArray(error[key])) {
      (error[key] as string[]).forEach((err) => {
        if (isObject(err)) {
          const transformedError = transformError(err as unknown as ApiError);
          out = { ...out, ...transformedError };
        } else {
          out[key] = out[key] ? `${out[key]} ${err}` : err;
        }
      });
    } else {
      out[key] = (error[key] as string);
    }
  });
  return out;
};

export default transformError;
