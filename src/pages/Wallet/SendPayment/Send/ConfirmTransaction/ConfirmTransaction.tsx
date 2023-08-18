import React, { useEffect, useState } from "react";
import { generatePath, Navigate } from "react-router-dom";
import { Formik, FormikErrors } from "formik";
import Decimal from "decimal.js-light";
import { useTranslation } from "react-i18next";
import {
  CreateUnsignedTransactionResponse,
  FetchWalletDetailsResponse,
  LocalWalletData,
  PendingTransaction,
  Wallet,
} from "../../../../../types";
import { getOutputs, selectors as walletSelectors } from "../../../../../store/walletSlice";
import routes from "../../../../../router/routes";
import { FormatNumber } from "../../../../../components/FormatNumber";
import { piconeroToMonero } from "../../../../../utils";
import Loading from "../../../../../components/Loading";
import { Button } from "../../../../../components/Button";
import CreatingTransaction from "./CreatingTransaction";
import { FormErrors } from "../../../../../modules/FormErrors";
import { enter2FACode } from "../../../../../modules/2FAModals";
import { showConfirmationModal } from "../../../../../modules/ConfirmationModal";
import { Prompt } from "../../../../../components";
import CreatingTransactionStage from "./CreatingTransactionStage";
import { useAccountType, useSelector } from "../../../../../hooks";

const transformPriorityText = (priority: (string | undefined)): string => (priority ? priority.charAt(0) + priority.slice(1).toLowerCase() : "");

interface Props {
  loading: boolean;
  wallet: Wallet | null;
  walletId: string;
  stage: string;
  pendingTransaction: PendingTransaction;
  createTransaction: (data: { id: string, code: string }) => Promise<CreateUnsignedTransactionResponse>;
  pollCreateTransactionTask: (data: { taskId: string }) => Promise<CreateUnsignedTransactionResponse>;
  fetchWalletDetails: (data: { id: string }) => Promise<FetchWalletDetailsResponse>;
  syncMultisig: (id: string) => Promise<LocalWalletData | undefined>;
  transactionData: {
    address: string;
    amount: string;
    memo?: string;
    priority?: string;
    fee?: number | undefined;
  }
  is2FaEnabled: boolean;
  onEdit: (values: any) => void;
  errors: FormikErrors<{ address: string; amount: string; password: string; message: string; memo: string; priority: string; non_field_errors: string; }>;
}

const ConfirmTransaction: React.FC<Props> = ({
  loading,
  wallet,
  walletId,
  stage,
  pendingTransaction,
  fetchWalletDetails,
  createTransaction,
  pollCreateTransactionTask,
  syncMultisig,
  transactionData,
  is2FaEnabled,
  onEdit,
  errors: step1Errors,
}) => {
  const { t } = useTranslation();
  const [feeValue, setFeeValue] = useState<null | number>(null);
  const [inProgress, setInProgress] = useState(true);
  const currentWallet = useSelector(walletSelectors.getWallet);
  const { isEnterprise } = useAccountType();

  useEffect(() => {
    if (!feeValue && pendingTransaction.fee) setFeeValue(pendingTransaction.fee);
  }, [pendingTransaction]);

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values, { setErrors, resetForm }): Promise<void> => {
        if (wallet) {
          try {
            if (is2FaEnabled) {
              const resp = await enter2FACode({
                confirmCancel: (onConfirm: () => void, onGoBack: () => void): void => {
                  showConfirmationModal(
                    {
                      title: t("wallet.send.cancel.transaction.label"),
                      message: t("wallet.send.cancel.transaction.message"),
                      buttonText: t("wallet.send.cancel.transaction.label"),
                    },
                  ).then(onConfirm, onGoBack);
                },
                asyncCallback: (c: string) => createTransaction({
                  id: wallet.id,
                  code: c,
                }),
              });
              // polling task is required only for transactions without approvals
              if (resp.taskId) {
                await pollCreateTransactionTask({ taskId: resp.taskId });
                await getOutputs({ id: wallet.id });
                await syncMultisig(wallet.id);
              }
            } else {
              const resp = await createTransaction({
                id: wallet.id,
                code: "",
              });
              // polling task is required only for transactions without approvals
              if (resp.taskId) {
                await pollCreateTransactionTask({ taskId: resp.taskId });
                await getOutputs({ id: wallet.id });
                await syncMultisig(wallet.id);
              }
            }
            fetchWalletDetails({ id: wallet.id }).then(() => null);
            resetForm();
            setInProgress(false);
          } catch (err: any) {
            // eslint-disable-next-line
            console.error(err);
            setInProgress(false);
            if (err) {
              setErrors(err);
            }
          }
        }
      }}
    >
      {({
        handleSubmit,
        isSubmitting,
        errors,
      }): React.ReactElement => (
        <form className="m-auto md:w-3/4" name="form-sendPayment" onSubmit={handleSubmit}>
          {!inProgress && !isSubmitting && !Object.values(errors).length && <Navigate to={currentWallet.minApprovals > 0 ? `${generatePath(routes.wallet, { id: walletId })}/approvals` : `${generatePath(routes.wallet, { id: walletId })}/transactions`} />}
          {
            isSubmitting && (
              <Prompt
                when={inProgress || isSubmitting}
                title={t("wallet.send.transaction.inprogress.title")}
                message={t("wallet.send.transaction.inprogress.message1")}
              />
            )
          }
          {
            !isSubmitting && (
              <Prompt
                when={inProgress || isSubmitting}
                title={t("wallet.send.transaction.inprogress.title")}
                message={t("wallet.send.transaction.inprogress.message2")}
              />
            )
          }
          {!isSubmitting ? (
            <div>
              <CreatingTransactionStage
                address={transactionData?.address}
                memo={transactionData?.memo}
                priority={transformPriorityText(transactionData?.priority)}
                stage={stage}
                fee={pendingTransaction?.fee ? (
                  <span className="font-bold">
                    <FormatNumber value={piconeroToMonero(pendingTransaction.fee)} />
                    {" "}
                    XMR
                    (
                    {((parseFloat(piconeroToMonero(pendingTransaction.fee)) * 100) / parseFloat(transactionData?.amount)).toFixed(2)}
                    {t("wallet.send.percent.of.amount")}
                    )
                  </span>
                ) : (loading ? <Loading /> : "-")}
                total={pendingTransaction?.fee ? <span className="font-bold text-2xl"><FormatNumber value={new Decimal(transactionData?.amount || 0).plus(parseFloat(piconeroToMonero(pendingTransaction?.fee || 0))).toString()} /></span> : <Loading />}
                loading={loading}
              />
              <FormErrors errors={errors} />
              <FormErrors fields={["address", "amount", "password", "memo"]} errors={step1Errors} />
              <div className="flex justify-end space-x-3 mt-5 mb-16">
                <Button
                  size={Button.size.BIG}
                  onClick={(): void => {
                    onEdit(transactionData);
                  }}
                >
                  {t("wallet.send.edit")}
                </Button>
                <Button
                  type="submit"
                  name="submit-btn"
                  variant={
                    isEnterprise
                      ? Button.variant.ENTERPRISE_LIGHT
                      : Button.variant.PRIMARY_LIGHT
                  }
                  size={Button.size.BIG}
                  disabled={!pendingTransaction?.fee || loading || Object.keys(errors).length > 0}
                  loading={loading}
                >
                  {t("wallet.send.confirm.payment")}
                </Button>
              </div>
            </div>
          ) : (
            <CreatingTransaction
              amount={transactionData?.amount}
              address={transactionData?.address}
              priority={transformPriorityText(transactionData?.priority)}
              fee={piconeroToMonero(feeValue || "")}
              stage={stage}
            />
          )}
        </form>
      )}
    </Formik>
  );
};

export default ConfirmTransaction;
