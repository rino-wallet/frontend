import React, {useEffect, useState} from "react";
import {
  CreateUnsignedTransactionResponse,
  FetchWalletDetailsResponse,
  LocalWalletData,
  PendingTransaction,
  Wallet,
} from "../../../../types";
import {generatePath, useNavigate} from "react-router-dom";
import {Formik, FormikErrors} from "formik";
import { getOutputs } from "../../../../store/walletSlice";
import routes from "../../../../router/routes";
import {Label} from "../../../../components/Label";
import {FormatNumber} from "../../../../components/FormatNumber";
import {piconeroToMonero} from "../../../../utils";
import Loading from "../../../../components/Loading";
import {Button} from "../../../../components/Button";
import CreatingTransaction from "./CreatingTransaction";
import {FormErrors} from "../../../../modules/FormErrors";
import { enter2FACode } from "../../../../modules/2FAModals";
import { showConfirmationModal } from "../../../../modules/ConfirmationModal";
import {Spinner} from "../../../../components/Spinner";
import { BeforeUnloadConfirm } from "../../../../components";

const transformPriorityText = (priority: (string | undefined)): string => priority ? priority.charAt(0) + priority.slice(1).toLowerCase() : "";

interface Props {
  loading: boolean;
  wallet: Wallet | null;
  walletId: string;
  stage: string;
  pendingTransaction: PendingTransaction;
  createTransaction: (data: { id: string, code: string }) => Promise<CreateUnsignedTransactionResponse>;
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
  syncMultisig,
  transactionData,
  is2FaEnabled,
  onEdit,
  errors: step1Errors,
}) => {
  const navigate = useNavigate();

  const [feeValue, setFeeValue] = useState<null | number>(null)
  useEffect(() => {
    if(!feeValue && pendingTransaction.fee) setFeeValue(pendingTransaction.fee)
  }, [pendingTransaction])

  return (<Formik
    initialValues={{}}
    onSubmit={async (values, { setErrors, resetForm }): Promise<void> => {
      if (wallet) {
        try {
          let code = "";
          if (is2FaEnabled) {
            code = await enter2FACode({
              confirmCancel: (onConfirm: () => void, onGoBack: () => void): void => {
                showConfirmationModal(
                  {
                    title: "Cancel transaction",
                    message: "Cancelling transaction cannot be undone.",
                    buttonText: "cancel transaction"
                  }
                ).then(onConfirm, onGoBack);
              }
            });
          }
          await createTransaction({
            id: wallet.id,
            code,
          });
          await getOutputs({ id: wallet.id });
          await syncMultisig(wallet.id);
          fetchWalletDetails({ id: wallet.id }).then(() => null);
          resetForm();
          navigate(`${generatePath(routes.wallet, { id: walletId })}/transactions`);
        } catch(err: any) {
          console.error(err);
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
    }): React.ReactElement => <form name="form-sendPayment" onSubmit={handleSubmit}>
      <BeforeUnloadConfirm needConfirmation />
      {!isSubmitting ? (<div className="m-auto md:w-3/4">
        { loading ? (<div className="md:flex md:space-x-6">
            <div className="mb-2 text-sm theme-text uppercase font-catamaran leading-none md:mt-6 md:w-1/4 hidden md:block">
              <Spinner size={85} />
            </div>
            <div className={"md:w-3/4"}>
              <div className="flex items-center text-2xl mb-3 font-bold theme-text-error mb-8">Hold on! <div className="md:hidden ml-3"><Spinner size={18} /></div></div>
              <div className="mb-4 text-l font-bold" data-qa-selector="creating-wallet-step">{stage}...</div>
              <div className="text-base mb-10">
                Creating transaction takes time - up to a couple of minutes. <br/>
                <span className="font-bold">Please do not close this window.</span> <br/>
                You will be asked to confirm the transaction and fee in a second.
              </div>
            </div>
          </div>) : null}
        <div className="form-field">
          <Label label="amount">
            <span data-qa-selector="transaction-amount"><FormatNumber value={transactionData?.amount} /></span> XMR
          </Label>
        </div>
        <div className="form-field">
          <Label label="Destination Address">
            <span className="theme-text-primary break-all"
                  data-qa-selector="transaction-dest-address">
              {transactionData?.address}
            </span>
          </Label>
        </div>
        {
          transactionData?.memo && (
            <div className="form-field break-all">
              <Label label="Internal Memo">
                <span data-qa-selector="transaction-memo">{transactionData?.memo}</span>
              </Label>
            </div>
          )
        }
        <div className="form-field">
          <Label label="priority">
            <span data-qa-selector="transaction-priority">{transformPriorityText(transactionData?.priority)}</span>
          </Label>
        </div>
        <div className="form-field">
          <Label label="fee">
            <span
              className="break-all"
              data-qa-selector="transaction-fee"
            >
              {pendingTransaction?.fee ? <span><FormatNumber value={piconeroToMonero(pendingTransaction.fee)} /> XMR
                ({(parseFloat(piconeroToMonero(pendingTransaction.fee)) * 100/parseFloat(transactionData?.amount)).toFixed(2)}% of transaction amount) </span> : (loading ? <Loading /> : "-")}
            </span>
          </Label>
        </div>
        <FormErrors errors={errors}/>
        <FormErrors fields={["address", "amount", "password", "memo"]} errors={step1Errors}/>
        <div className="flex justify-end space-x-3 mt-10">
          <Button onClick={(): void => {
            onEdit(transactionData);
          }}>Edit</Button>
          <Button
            type="submit"
            name="submit-btn"
            variant={Button.variant.PRIMARY_LIGHT}
            size={Button.size.BIG}
            disabled={!pendingTransaction?.fee}
            loading={loading}
          >
            Confirm Payment
          </Button>
        </div>
      </div>) : (
      <CreatingTransaction
        amount={transactionData?.amount}
        address={transactionData?.address}
        priority={transformPriorityText(transactionData?.priority)}
        fee={piconeroToMonero(feeValue || "")}
        stage={stage}
      />
    )}
    </form>}
  </Formik>);
};

export default ConfirmTransaction;