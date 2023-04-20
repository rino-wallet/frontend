import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import { ObjectSchema } from "yup";
import { createModal } from "../../../modules/ModalFactory";
import {
  ShareWalletThunkPayload, ShareWalletResponse, Wallet, WalletMember,
} from "../../../types";
import { accessLevels } from "../../../constants";
import { FormErrors, Modal } from "../../../modules/index";
import {
  Button, Label, Input, BindHotKeys, Tooltip, Select, DisableAutofill, Icon,
} from "../../../components";
import { IconName } from "../../../components/Icon";
import { enter2FACode } from "../../../modules/2FAModals";
import { useAccountType } from "../../../hooks";

const getValidationSchema = (member: WalletMember | null = null): ObjectSchema<any> => yup.object().shape({
  password: yup.string().when("access_level", {
    is: (access_level: string) => parseInt(access_level, 10) === accessLevels.admin.code,
    then: yup.string().required("This field is required."),
  }),
  access_level: yup.string()
    .test(
      "test-access-level-same",
      `User already has ${member?.accessLevel} access.`,
      (value) => {
        const currentAccessLevel = Object.values(accessLevels).find((val: any) => val.code === parseInt(value || "0", 10));
        return member !== null ? member.accessLevel !== currentAccessLevel?.title : true;
      },
    ).required("This field is required."),
});

interface Props {
  wallet: Wallet;
  member: WalletMember;
  is2FaEnabled: boolean;
  submit: (data: { email: string; password: string; accessLevel: number }) => Promise<void>;
  cancel: () => void;
  email: string;
  shareWallet: (data: ShareWalletThunkPayload) => Promise<ShareWalletResponse>;
  refresh: () => Promise<void>;
}

const iconsMap: { [key: string]: string } = {
  10: "account",
  20: "settings",
  30: "arrow-down-bold",
  35: "security-on",
  40: "eye",
};

const WalletMemberModal: React.FC<Props> = ({
  wallet, member, is2FaEnabled, email, shareWallet, cancel, submit, refresh,
}) => {
  const { features } = useAccountType();
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
    validationSchema: getValidationSchema(member),
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
          email,
          accessLevel: parseInt(formValues.access_level, 10),
          update: !!member,
          wallet,
          code,
          member,
        });
        submit({
          password: formValues.password,
          email,
          accessLevel: accessLevels.admin.code,
        });
        refresh();
      } catch (err: any) {
        if (err) {
          setErrors(err);
        }
      }
    },
  });
  return (
    <BindHotKeys callback={handleSubmit} rejectCallback={cancel}>
      <Modal className="!z-10" title={member ? "Change wallet access" : "Confirm Sharing"} onClose={cancel} showCloseIcon>
        <form onSubmit={handleSubmit}>
          <DisableAutofill />
          <Modal.Body>
            <div className="form-field">
              <p className="break-words">
                Please select the desired access level for wallet
                {" "}
                {"\""}
                {wallet.name}
                {"\""}
                {member ? ` for ${email}.` : "."}
              </p>
            </div>
            <div className="form-field">
              <Label label="User email">
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
                  icon={iconsMap[values.access_level] as IconName}
                  name="access_level"
                  value={values.access_level}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.access_level ? errors.access_level || "" : ""}
                >
                  <option
                    value=""
                  >
                    {" "}
                  </option>
                  {
                    // we temporarily hide "View-only" role, just remove filter to revert it
                    Object.values(accessLevels)
                      .filter((level) => (features.viewOnlyShare ? true : !["View-only", "Approver", "Spender"].includes(level.value)))
                      .filter((option) => option.code !== accessLevels.owner.code)
                      .filter((option) => {
                        if (member) {
                          return member.accessLevel !== option.value;
                        }
                        return true;
                      })
                      .map((option) => <option key={option.code} value={option.code}>{option.title}</option>)
                  }
                </Select>
              </Label>
            </div>
            {
              (parseInt(values.access_level, 10) === accessLevels.admin.code || parseInt(values.access_level, 10) === accessLevels.spender.code) && (
                <div className="form-field">
                  <Label label={(
                    <div>
                      <Tooltip
                        content={(
                          <div className="md:w-96 text-sm normal-case" data-qa-selector="tx-priority-tooltip">
                            Password of your account. Required for sharing the wallet.
                          </div>
                        )}
                      >
                        Account Password
                        {" "}
                        <div className="text-sm cursor-pointer inline-block" data-qa-selector="cursor-pointer-tx-priority-tooltip"><Icon name="info" /></div>
                      </Tooltip>
                    </div>
                  )}
                  >
                    <Input
                      autoComplete="current-password"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      error={touched.password ? errors.password || "" : ""}
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
              {member ? "Change" : "Share"}
            </Button>
          </Modal.Actions>
        </form>
      </Modal>
    </BindHotKeys>
  );
};

export default createModal(WalletMemberModal);
