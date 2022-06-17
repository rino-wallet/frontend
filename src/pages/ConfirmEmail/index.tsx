import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeLocation } from "../../store/actions";
import ConfirmEmail from "./ConfirmEmail";

const ConfirmEmailPageContainer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => (): void => {
    dispatch(changeLocation());
  }, []);
  return <ConfirmEmail />;
};

export default ConfirmEmailPageContainer;
