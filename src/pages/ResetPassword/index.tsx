import React from "react";
import { Route, Routes } from "react-router-dom";
import ResetPasswordRequest from "./ResetPasswordRequest";
import ResetPasswordConfirm from "./ResetPasswordConfirm";

const ResetPasswordPageContainer: React.FC = () => {
  return (
    <Routes>
      <Route
        path="reset"
        element={<ResetPasswordRequest />}
      />
      <Route
        path="/reset/confirm/:userId/:token"
        element={<ResetPasswordConfirm />}
      />
    </Routes>
  )
}

export default ResetPasswordPageContainer;
