import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

interface Props {
  errors: any;
  fields?: string[];
}

export const FormErrors: React.FC<Props> = ({ errors, fields = [] }) => {
  const { t } = useTranslation();
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
        entries.map(([key, error]) => <p id={`error-messsage-${key}`} key={`${key}-${error}`}>{t(error as string)}</p>)
      }
    </div>
  );
};
