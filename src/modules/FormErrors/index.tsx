import React from "react";
import classNames from "classnames";

interface Props {
  errors: any;
  fields?: string[];
}

export const FormErrors: React.FC<Props> = ({ errors, fields = [] }) => {
  const entries = Object.entries(errors).filter(([key]) => [
    ...fields,
    "message",
    "detail",
    "non_field_errors",
    "2fa",
  ].includes(key));
  return (
    <div className={classNames("theme-text-error")}>
      {
        entries.map(([key, error]) => <p id={`error-messsage-${key}`} key={`${key}-${error}`}>{error as string}</p>)
      }
    </div>
  )
}