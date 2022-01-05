import React, { useEffect } from "react";
import { useDispatch, useSelector } from "../../hooks";
import { navigate } from "../../store/actions";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import Profile from "./Profile";

const ProfilePageContainer: React.FC = () => {
  const user = useSelector(sessionSelectors.getUser);
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  return user ? (
    <Profile
      user={user}
    />
  ) : null;
}

export default ProfilePageContainer;
