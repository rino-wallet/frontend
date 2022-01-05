import React, { useEffect } from "react";
import { ModalContainer } from "promodal";
import {
  useHistory,
} from "react-router-dom";
import PrivateRouter from "./modules/PrivateRouter";
import { useSelector, useThunkActionCreator } from "./hooks";
import { getCurrentUser as getCurrentUserAction } from "./store/sessionSlice";
import { UserResponse } from "./types";
import routes from "./router/routes";

const App: React.FC = () => {
  const { push } = useHistory();
  const token = useSelector(state => state.session.token);
  const user = useSelector(state => state.session.user);
  const password = useSelector(state => state.session.password);
  const getCurrentUser = useThunkActionCreator<UserResponse, void>(getCurrentUserAction);
  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
  }, [token]);
  useEffect(() => {
    if (user && !user.isKeypairSet && password) {
      push(routes.keypair);
    }
  }, [user]);
  return (
    <div className="app">
      <div className="relative z-20">
        <ModalContainer />
      </div>
      <PrivateRouter isAuthenticated={!!token} />
    </div>
  );
}

export default App;
