import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeLocation } from "../../store/actions";
import AcceptWalletShare from "./AcceptWalletShare";

const AcceptWalletShareContainer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeLocation());
  }, []);
  return <AcceptWalletShare />;
};

export default AcceptWalletShareContainer;
