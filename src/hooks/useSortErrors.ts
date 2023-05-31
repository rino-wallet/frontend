import { useState } from "react";

export const useSortErrors = (notFormField: string[]) => {
  const [nonFieldErrors, setNonFieldErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  function sortErrors(errors: { [key: string]: string }): {
    nonFieldErrors: { [key: string]: string };
    fieldErrors: { [key: string]: string };
  } {
    const nonFieldErrorsVal = notFormField.reduce((ac, a) => ({ ...ac, [a]: errors[a] }), {});
    const fieldErrorsVal = Object.keys(errors)
      .filter((key: string) => !notFormField.includes(key))
      .reduce((ac, a) => ({ ...ac, [a]: errors[a] }), {});
    setNonFieldErrors(nonFieldErrorsVal);
    setFieldErrors(fieldErrorsVal);
    return {
      nonFieldErrors: nonFieldErrorsVal,
      fieldErrors: fieldErrorsVal,
    };
  }
  return {
    resetSortedErrors: () => {
      setNonFieldErrors({});
      setFieldErrors({});
    },
    nonFieldErrors,
    fieldErrors,
    sortErrors,
  };
};
