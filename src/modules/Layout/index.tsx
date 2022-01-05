import React from "react";
import { useThunkActionCreator } from "../../hooks";
import { PublicLayout, PrivateLayout } from "./Layout";
import { signOut as signOutAction } from "../../store/sessionSlice";

export const PublicLayoutContainer: React.FC = ({ children }) => {
  return (
    <PublicLayout>
      {children}
    </PublicLayout>  
  )
}

export const PrivateLayoutContainer: React.FC = ({ children }) => {
  const signOut = useThunkActionCreator<void, void>(signOutAction);
  return (
    <PrivateLayout signOut={signOut}>
      {children}
    </PrivateLayout>  
  )
}
