import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "../../components";
import { useAccountType } from "../../hooks";

interface Props {
  stage: string;
}

const CreatingWallet: FC<Props> = ({ stage }) => {
  const { t } = useTranslation();
  const { isEnterprise } = useAccountType();

  return (
    <div id="creating-wallet">
      <div className="flex items-center text-xl mb-3">
        <span className="mr-4">{t("new.wallet.form.creating")}</span>
        {" "}
        <Spinner size={18} isEnterprise={isEnterprise} />
      </div>

      <div className="text-base mb-3">
        {t("new.wallet.form.creating.message")}
      </div>

      <div id="creating-wallet-step">
        {t(stage)}
        ...
      </div>
    </div>
  );
};

export default CreatingWallet;
