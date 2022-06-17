import React from "react";
import { useThunkActionCreator, useSelector } from "../../hooks";
import { Layout } from "./Layout";
import { signOut as signOutAction } from "../../store/sessionSlice";
import "./styles.css";

interface Props {
  page?: string;
}

export const LayoutContainer: React.FC<Props> = ({ children, page }) => {
  const signOut = useThunkActionCreator<void, void>(signOutAction);
  const token = useSelector((state) => state.session.token);
  return (
    <Layout signOut={signOut} isAuthenticated={token} page={page}>
      {children}
    </Layout>
  );
};
