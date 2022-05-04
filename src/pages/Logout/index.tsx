import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThunkActionCreator } from "../../hooks";
import { signOut as signOutThunk } from "../../store/sessionSlice";
import routes from "../../router/routes";

const LogoutContainer: React.FC = () => {
  const navigate = useNavigate();
  const signOut = useThunkActionCreator(signOutThunk);
  useEffect(() => {
    signOut().finally(() => {
      navigate(routes.login);
    })
  }, [])
  return null;
}

export default LogoutContainer;
