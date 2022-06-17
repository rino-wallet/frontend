import React, { useEffect, useRef, useState } from "react";
import { useThunkActionCreator, useSelector, useDispatch } from "../../hooks";
import {
  createNewWallet,
  persistWallet as persistWalletAction,
  selectors as walletSelectors,
} from "../../store/walletSlice";
import {
  selectors as sessionSelectors,
} from "../../store/sessionSlice";
import NewWallet from "./NewWallet";
import { changeLocation } from "../../store/actions";
import { AppDispatch, LocalWalletData } from "../../types";

const NewWalletContainer: React.FC = () => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  const user = useSelector(sessionSelectors.getUser);
  const stage = useSelector(walletSelectors.getStage);
  const isWalletCreating = useSelector(walletSelectors.pendingCreateNewWallet);
  const createWalletThunk = useThunkActionCreator(createNewWallet);
  const createMultisigWallet: (data: { name: string }) => Promise<{ userWallet: LocalWalletData; backupWallet: LocalWalletData; walletId: string; walletPassword: string }> = ((data: { name: string }) => {
    const promise = createWalletThunk({ signal, ...data });
    setWalletCreatePromise(promise);
    return promise;
  });
  const persistWallet = useThunkActionCreator(persistWalletAction);
  const dispatch = useDispatch();
  const [walletCreatePromise, setWalletCreatePromise] = useState<Promise<AppDispatch> | any>(null);
  const valueRef: { current: Promise<AppDispatch> | any } = useRef();

  useEffect(() => (): void => {
    dispatch(changeLocation());
    abortController.abort();
  }, []);

  useEffect(() => {
    valueRef.current = walletCreatePromise;
  }, [walletCreatePromise]);
  return (
    <NewWallet
      isKeypairSet={!!user?.isKeypairSet}
      createMultisigWallet={createMultisigWallet}
      stage={stage}
      username={user?.username || ""}
      isWalletCreating={isWalletCreating}
      persistWallet={persistWallet}
    />
  );
};

export default NewWalletContainer;
