import React from "react";
import ResetPasswordRequest from "./ResetPasswordRequest";
import ResetPasswordConfirm from "./ResetPasswordConfirm";
import { Switch, Route } from "react-router-dom";
import routes from "../../router/routes";

const ResetPasswordPageContainer: React.FC = () => {
  return (
    <Switch>
      <Route
        exact
        path={routes.resetPasswordRequest}
        component={ResetPasswordRequest}
      />
      <Route
        path={routes.resetPasswordConfirm}
        component={ResetPasswordConfirm}
      />
    </Switch>
  )
}

export default ResetPasswordPageContainer;
