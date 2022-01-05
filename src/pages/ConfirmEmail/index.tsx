import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { navigate } from "../../store/actions";
import ConfirmEmail from "./ConfirmEmail";

const ConfirmEmailPageContainer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return (): void => {
      dispatch(navigate());
    }
  }, [])
  return <ConfirmEmail />
}

export default ConfirmEmailPageContainer;
