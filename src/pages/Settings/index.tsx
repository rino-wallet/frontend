import React, { useEffect } from "react";
import { useDispatch, useSelector, useThunkActionCreator } from "../../hooks";
import {
  updateUser as updateUserThunk,
  signOutAll as signOutAllThunk,
  selectors as sessionSelectors,
} from "../../store/sessionSlice";
import { changeLocation } from "../../store/actions";
import SettingsPage from "./Settings";

const SettingsPageContainer: React.FC = () => {
  const pendingUpdateUser = useSelector(sessionSelectors.pendingUpdateUser);
  const updateUser = useThunkActionCreator(updateUserThunk);
  const signOutAll = useThunkActionCreator(signOutAllThunk);
  const user = useSelector(sessionSelectors.getUser);
  const dispatch = useDispatch();
  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);
  return user ? (
    <SettingsPage
      pendingUpdateUser={pendingUpdateUser}
      updateUser={updateUser}
      signOutAll={signOutAll}
      user={user}
    />
  ) : null;
};

export default SettingsPageContainer;
