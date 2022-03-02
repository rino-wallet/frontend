import React, { useEffect } from "react";
import { useDispatch, useSelector, useThunkActionCreator } from "../../hooks";
import {
  updateUser as updateUserThunk,
} from "../../store/sessionSlice";
import { changeLocation } from "../../store/actions";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import Profile from "./Profile";

const ProfilePageContainer: React.FC = () => {
  const pendingUpdateUser = useSelector(sessionSelectors.pendingUpdateUser);
  const updateUser = useThunkActionCreator(updateUserThunk);
  const user = useSelector(sessionSelectors.getUser);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(changeLocation());
    }
  }, [])
  return user ? (
    <Profile
      pendingUpdateUser={pendingUpdateUser}
      updateUser={updateUser}
      user={user}
    />
  ) : null;
}

export default ProfilePageContainer;
