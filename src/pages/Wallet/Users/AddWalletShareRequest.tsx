import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { createModal } from "../../../modules/ModalFactory";
import {
  Wallet,
  RequestWalletShareThunkPayload,
} from "../../../types";
import { FormErrors, Modal } from "../../../modules/index";
import {
  Button, Label, Input, BindHotKeys, Tooltip, DisableAutofill, Icon,
} from "../../../components";
import { enter2FACode } from "../../../modules/2FAModals";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("This field is required."),
});

interface Props {
  wallet: Wallet;
  is2FaEnabled: boolean;
  isEnterprise: boolean;
  submit: (data: { email: string }) => Promise<void>;
  cancel: () => void;
  requestWalletShare: (data: RequestWalletShareThunkPayload) => Promise<Record<string, never>>;
}

const AddWalletShareRequest: React.FC<Props> = ({
  wallet, is2FaEnabled, isEnterprise, requestWalletShare, cancel, submit,
}) => {
  const {
    isValid,
    dirty,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    validationSchema,
    initialValues: {
      email: "",
      encrypted_keys: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        let code = "";
        if (is2FaEnabled) {
          code = await enter2FACode();
        }
        await requestWalletShare({
          email: formValues.email,
          wallet,
          code,
        });
        submit({
          email: formValues.email,
        });
      } catch (err: any) {
        if (err) {
          setErrors(err);
        }
      }
    },
  });
  return (
    <BindHotKeys callback={handleSubmit} rejectCallback={cancel}>
      <Modal title="Invite wallet user" onClose={cancel} className="!z-10" showCloseIcon>
        <form onSubmit={handleSubmit}>
          <DisableAutofill />
          <Modal.Body>
            <div className="form-field">
              <p>
                You can only invite users that already have a RINO
                {" "}
                {isEnterprise ? "enterprise" : "community"}
                {" "}
                account.
              </p>
            </div>
            <div className="form-field">
              <p>You can pick a role for the invited user once they accept.</p>
            </div>
            <div className="form-field">
              <Label label={(
                <div>
                  <Tooltip
                    content={(
                      <div className="md:w-76 text-sm text-center normal-case" data-qa-selector="tx-priority-tooltip">
                        Address of the user you are inviting.
                      </div>
                    )}
                  >
                    User email address
                    {" "}
                    <div className="text-sm cursor-pointer inline-block" data-qa-selector="cursor-pointer-tx-priority-tooltip">
                      <Icon name="info" />
                    </div>
                  </Tooltip>
                </div>
              )}
              >
                <Input
                  autoComplete="off"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="User Email Address"
                  error={touched.email ? errors.email || "" : ""}
                />
              </Label>
            </div>
            <FormErrors errors={errors} />
          </Modal.Body>
          <Modal.Actions>
            <Button
              disabled={isSubmitting}
              type="button"
              name="cancel-btn"
              onClick={cancel}
            >
              Cancel
            </Button>
            <Button
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              name="submit-btn"
              loading={isSubmitting}
              variant={Button.variant.PRIMARY_LIGHT}
            >
              Invite
            </Button>
          </Modal.Actions>
        </form>
      </Modal>
    </BindHotKeys>
  );
};

export default createModal(AddWalletShareRequest);
