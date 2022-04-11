import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { createModal } from "promodal";
import { ShareWalletThunkPayload, ShareWalletResponse, Wallet } from "../../../types";
import { accessLevels } from "../../../constants";
import { FormErrors, Modal } from "../../../modules/index";
import { Button, Label, Input, BindHotKeys, Tooltip, Select, DisableAutofill } from "../../../components";
import { enter2FACode } from "../../../modules/2FAModals";
import { ReactComponent as InfoIcon } from "../SendPayment/TransactionForm/16px_info.svg";

const validationSchema = yup.object().shape({
  password: yup.string().when("access_level", {
    is: (access_level: string) => parseInt(access_level, 10) === accessLevels.admin.code,
    then:  yup.string().required("This field is required.")
  }),
  access_level: yup.string().required("This field is required."),
});

interface Props {
  wallet: Wallet;
  is2FaEnabled: boolean;
  submit: (data: { email: string; password: string; accessLevel: number }) => Promise<void>;
  cancel: () => void;
  email: string;
  shareWallet: (data: ShareWalletThunkPayload) => Promise<ShareWalletResponse>;
}

const AddWalletMember: React.FC<Props> = ({ wallet, is2FaEnabled, email, shareWallet, cancel, submit }) => {
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
      password: "",
      access_level: "",
      encrypted_keys: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        let code = "";
        if (is2FaEnabled) {
          code = await enter2FACode();
        }
        await shareWallet({
          password: formValues.password,
          email: email,
          accessLevel: parseInt(formValues.access_level, 10),
          wallet,
          code,
        });
        submit({
          password: formValues.password,
          email: email,
          accessLevel: accessLevels.admin.code,
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
      <Modal title="Add Wallet User" onClose={cancel} showCloseIcon>
        <form onSubmit={handleSubmit}>
          <DisableAutofill />
          <Modal.Body>
            <div className="form-field">
              <p>You’re going to share access to {wallet.name}.</p>
            </div>
            <div className="form-field">
              <Label label={<div>
                <Tooltip
                  content={(
                    <div className="md:w-96 text-sm normal-case" data-qa-selector="tx-priority-tooltip">
                      Address of the user you are inviting.
                    </div>
                  )}
                >
                  User email address <div className="text-sm cursor-pointer inline-block" data-qa-selector="cursor-pointer-tx-priority-tooltip"><InfoIcon /></div>
                </Tooltip>
              </div>}>
                <Input
                  autoComplete="off"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(): null => null}
                  placeholder="User Email Address"
                  disabled
                />
              </Label>
            </div>
            <div className="form-field">
              <Label label="Access level">
                <Select
                  name="access_level"
                  value={values.access_level}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.access_level && errors.access_level || ""}
                >
                  <option value=""></option>
                  {
                    Object.values(accessLevels)
                      .filter(option => option.code !== accessLevels.owner.code)
                      .map((option) => <option key={option.code} value={option.code}>{option.title}</option>)
                  }
                </Select>
              </Label>
            </div>
            {
              parseInt(values.access_level) === accessLevels.admin.code && (
                <div className="form-field">
                  <Label label={<div>
                    <Tooltip
                      content={(
                        <div className="md:w-96 text-sm normal-case" data-qa-selector="tx-priority-tooltip">
                          Password of your account. Required for sharing the wallet.
                        </div>
                      )}
                    >
                      Account Password <div className="text-sm cursor-pointer inline-block" data-qa-selector="cursor-pointer-tx-priority-tooltip"><InfoIcon /></div>
                    </Tooltip>
                  </div>}>
                    <Input
                      autoComplete="current-password"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      error={touched.password && errors.password || ""}
                    />
                  </Label>
                </div>
              )
            }
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
              Add user
            </Button>
          </Modal.Actions>
        </form>
      </Modal>
    </BindHotKeys>
  );
};

export default createModal(AddWalletMember);
