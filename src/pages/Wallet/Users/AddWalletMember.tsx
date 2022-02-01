import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { createModal } from "promodal";
import { ShareWalletThunkPayload, ShareWalletResponse, Wallet } from "../../../types";
import { accessLevels } from "../../../constants";
import { FormErrors, Modal } from "../../../modules/index";
import { Button, Label, Input, BindHotKeys } from "../../../components";
import { enter2FACode } from "../../../modules/2FAModals";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("This field is required."),
  password: yup.string().required("This field is required."),
  // access_level: yup.string().required("This field is required."),
});

interface Props {
  wallet: Wallet;
  is2FaEnabled: boolean;
  submit: (data: { email: string; password: string; accessLevel: number }) => Promise<void>;
  cancel: () => void;
  shareWallet: (data: ShareWalletThunkPayload) => Promise<ShareWalletResponse>;
}

const AddWalletMember: React.FC<Props> = ({ wallet, is2FaEnabled, shareWallet, cancel, submit }) => {
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
      access_level: "",
      password: "",
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
          email: formValues.email,
          accessLevel: accessLevels.admin.code,
          wallet,
          code,
        }); 
        submit({
          password: formValues.password,
          email: formValues.email,
          accessLevel: accessLevels.admin.code,
        });
      } catch (err) {
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
          <Modal.Body>
            <div className="form-field">
              <p>You’re going to share access to {wallet.name}.</p>
            </div>
            <div className="form-field">
              <Label label="User email address">
                <Input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="User Email Address"
                  error={touched.email && errors.email || ""}
                />
              </Label>
            </div>
            {/* <div className="form-field">
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
            </div> */}
            <div className="form-field">
              <Label label="Account Password">
                <Input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="password"
                  error={touched.password && errors.password || ""}
                />
              </Label>
            </div>
            {
              parseInt(values.access_level) === accessLevels.admin.code && (
                <div className="form-field">
                  <Label label="Password">
                    <Input
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
