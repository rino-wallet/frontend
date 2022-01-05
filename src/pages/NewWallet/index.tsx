import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "../../hooks"
import { createNewWallet, selectors as walletSelectors } from "../../store/walletSlice";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import { useThunkActionCreator } from "../../hooks";
import NewWallet from "./NewWallet";
import WalletCreated from "./WalletCreated";
import { navigate } from "../../store/actions";

const NewWalletContainer: React.FC = () => {
  const { url } = useRouteMatch();
  const user = useSelector(sessionSelectors.getUser);
  const stage = useSelector(walletSelectors.getStage);
  const isWalletCreating = useSelector(walletSelectors.pendingCreateNewWallet);
  const createMultisigWallet = useThunkActionCreator(createNewWallet);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  return <Switch>
    <Route exact path={url}>
      <NewWallet
        isKeypairSet={!!user?.isKeypairSet}
        createMultisigWallet={createMultisigWallet}
        stage={stage}
        isWalletCreating={isWalletCreating}
      />
    </Route>
    <Route path={`${url}/:id`}>
      <WalletCreated />
    </Route>
  </Switch>
}

export default NewWalletContainer;
