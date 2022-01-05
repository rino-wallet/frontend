import React, { useEffect } from "react";
import { useThunkActionCreator, useSelector, useDispatch } from "../../hooks"
import {
  createNewWallet,
  persistWallet as persistWalletAction,
  selectors as walletSelectors
} from "../../store/walletSlice";
import {
  selectors as sessionSelectors,
  setPreventNavigation as setPreventNavigationAction
} from "../../store/sessionSlice";
import NewWallet from "./NewWallet";
import { changeLocation } from "../../store/actions";

const NewWalletContainer: React.FC = () => {
  const user = useSelector(sessionSelectors.getUser);
  const stage = useSelector(walletSelectors.getStage);
  const isWalletCreating = useSelector(walletSelectors.pendingCreateNewWallet);
  const createMultisigWallet = useThunkActionCreator(createNewWallet);
  const persistWallet = useThunkActionCreator(persistWalletAction);
  const dispatch = useDispatch();
  const setPreventNavigation = (value: boolean): void => { dispatch(setPreventNavigationAction(value)); };
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, [])
  return(
    <NewWallet
      isKeypairSet={!!user?.isKeypairSet}
      createMultisigWallet={createMultisigWallet}
      stage={stage}
      username={user?.username || ""}
      isWalletCreating={isWalletCreating}
      setPreventNavigation={setPreventNavigation}
      persistWallet={persistWallet}
    />
  )
}

export default NewWalletContainer;
