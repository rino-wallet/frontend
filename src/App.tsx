import React, { useEffect } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ModalContainer } from "./modules/ModalFactory";
import { PrivateRouter, showWarningModal } from "./modules/index";
import { useSelector, useThunkActionCreator, useWindowSize } from "./hooks";
import { IsMobileProvider } from "./hooks/useIsMobile";
import { getCurrentUser as getCurrentUserThunk, signOut as signOutThunk } from "./store/sessionSlice";
import { IdleTimer } from "./utils";
import routes from "./router/routes";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.session.token);
  const user = useSelector((state) => state.session.user);
  const password = useSelector((state) => state.session.password);
  const windowSize = useWindowSize();
  const getCurrentUser = useThunkActionCreator(getCurrentUserThunk);
  const signOut = useThunkActionCreator(signOutThunk);
  async function onTimeOut(): Promise<void> {
    await signOut();
    showWarningModal({
      title: "Session Timeout",
      message: "Sorry! Your session has expired due to inactivity. Please log in again.",
    });
  }
  useEffect(() => {
    let timer: IdleTimer;
    if (token) {
      timer = new IdleTimer({
        timeout: 15 * 60, // expire after 15m
        onTimeout: (): void => { onTimeOut(); },
        onExpired: (): void => { onTimeOut(); },
      });
    }
    return () => {
      timer?.cleanUp();
    };
  }, [token]);
  useEffect(() => {
    if (token && !user) {
      getCurrentUser();
    }
  }, [token]);
  useEffect(() => {
    if (user && !user.isKeypairSet && password) {
      navigate(routes.keypair);
    }
  }, [user]);
  useEffect(() => {
    if (location.search.includes("business=true")) {
      navigate(location.pathname.replace("business=true", ""), { replace: true });
      sessionStorage.setItem("enterprice", "true");
    }
  }, []);
  return (
    <div className="app">
      <IsMobileProvider value={windowSize}>
        <PrivateRouter isAuthenticated={!!token} />
        <div className="relative z-50">
          <ModalContainer />
        </div>
      </IsMobileProvider>
    </div>
  );
};

export default App;
