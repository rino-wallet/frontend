import React, { useEffect, useState } from "react";
import Decimal from "decimal.js-light";
import { FormikErrors } from "formik";
import { Label } from "../../../../../components";
import { ExchangeDetails } from "../ExchangeDetails";
import {
  CreateUnsignedTransactionResponse,
  Destination,
  ExchangeOrder,
  FetchWalletDetailsResponse,
  GetOutputsPayload,
  LocalWalletData,
  PendingTransaction,
  User,
  UseThunkActionCreator,
  Wallet,
} from "../../../../../types";
import ConfirmTransaction from "../../Send/ConfirmTransaction/ConfirmTransaction";
import { piconeroToMonero, satoshiToBTC } from "../../../../../utils";
import { transactionPriorities } from "../../../../../constants";
import { enterPasswordModal } from "../../../../../modules/index";

interface Props {
  wallet: Wallet | null;
  walletId: string;
  stage: string;
  pendingTransaction: PendingTransaction;
  order?: ExchangeOrder;
  user?: User;
  onEdit: (values: any) => void;
  createTransaction: (data: { id: string, code: string }) => Promise<CreateUnsignedTransactionResponse>;
  pollCreateTransactionTask: (data: { taskId: string }) => Promise<CreateUnsignedTransactionResponse>;
  fetchWalletDetails: (data: { id: string }) => Promise<FetchWalletDetailsResponse>;
  syncMultisig: (id: string) => Promise<LocalWalletData | undefined>;
  openWallet: ({ wallet, loginPassword }: { wallet: Wallet, loginPassword: string }) => UseThunkActionCreator<LocalWalletData>;
  getOutputs: ({ id }: GetOutputsPayload) => UseThunkActionCreator<LocalWalletData | undefined>;
  prepareTransaction: (
    data: { id: string, body: Destination, memo: string, priority: string, orderId: string }
  ) => UseThunkActionCreator<CreateUnsignedTransactionResponse>;
  setCurrentWalletCall: (call: any) => void;
}

const ExchangePayment: React.FC<Props> = ({
  wallet,
  walletId,
  stage,
  pendingTransaction,
  order,
  user,
  onEdit,
  createTransaction,
  pollCreateTransactionTask,
  fetchWalletDetails,
  syncMultisig,
  openWallet,
  getOutputs,
  prepareTransaction,
  setCurrentWalletCall,
}) => {
  const [preparingTransaction, setPreparingTransaction] = useState(false);
  const [errors, setErrors] = useState<FormikErrors<{ address: string; amount: string; password: string; message: string; memo: string; priority: string; non_field_errors: string; }>>({});
  async function prepareTransactionForExchange(): Promise<void> {
    if (wallet) {
      try {
        await enterPasswordModal({
          callback: async (password: string) => {
            const openWalletPromise = openWallet({ wallet, loginPassword: password });
            setCurrentWalletCall(openWalletPromise);
            return openWalletPromise;
          },
        })
          .catch(onEdit);
        setPreparingTransaction(true);
        const getOutputsPromise = getOutputs({ id: wallet.id });
        setCurrentWalletCall(getOutputsPromise);
        await getOutputsPromise;

        const prepareTransactionPromise = prepareTransaction({
          id: wallet.id,
          body: { address: order?.paymentAddress || "", amount: order?.paymentAmount as number },
          orderId: order?.id as string,
          memo: "",
          priority: transactionPriorities.Normal,
        });
        setCurrentWalletCall(prepareTransactionPromise);
        await prepareTransactionPromise;
        setPreparingTransaction(false);
      } catch (err: any) {
        // the error should be ignored if user press on "Edit" button
        setPreparingTransaction(false);
        if (err && err?.name !== "AbortError") {
          setErrors(err);
        }
      }
    }
  }
  const transactionData = {
    address: order?.paymentAddress as string,
    amount: `${piconeroToMonero(order?.paymentAmount as number)}`,
    priority: transactionPriorities.Normal,
  };
  useEffect(() => {
    prepareTransactionForExchange();
  }, []);
  return (
    <div>
      <div className="mb-5">
        <ConfirmTransaction
          loading={preparingTransaction}
          wallet={wallet}
          walletId={walletId}
          stage={stage}
          pendingTransaction={pendingTransaction}
          fetchWalletDetails={fetchWalletDetails}
          createTransaction={createTransaction}
          pollCreateTransactionTask={pollCreateTransactionTask}
          syncMultisig={syncMultisig}
          transactionData={transactionData}
          is2FaEnabled={!!user?.is2FaEnabled}
          onEdit={onEdit}
          errors={errors}
        />
      </div>
      <div className="m-auto md:w-3/4">
        <Label label="" inline>
          <h3 className="text-2xl mb-3 font-bold">Exchange in progress:</h3>
        </Label>
        <ExchangeDetails
          platform={order?.platform || ""}
          rate={new Decimal(satoshiToBTC(order?.outgoingAmount as number)).div(new Decimal(piconeroToMonero(order?.paymentAmount as number))).toNumber()}
          currency={order?.outgoingCurrency || ""}
          destinationAddress={order?.outgoingAddress || ""}
          exchangeID={order?.platformOrderId || ""}
        />
      </div>
    </div>
  );
};

export default ExchangePayment;
