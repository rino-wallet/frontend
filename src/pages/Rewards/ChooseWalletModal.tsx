import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { createModal } from "../../modules/ModalFactory";
import { Button, Input, Label } from "../../components";
import { FormErrors, Modal } from "../../modules/index";

const validationSchema = yup.object().shape({
  address: yup.string().required("This field is required."),
});

interface Props {
  submit: () => void;
  cancel: () => void;
  asyncCallback: (address: string) => Promise<any>;
}

const ChooseWalletModal = ({
  cancel, submit, asyncCallback,
}: Props) => {
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
      address: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        await asyncCallback(formValues.address);
        submit();
      } catch (err: any) {
        setErrors(err);
      }
    },
  });
  return (
    <Modal size={Modal.size.MEDIUM} title="Choose your wallet" showCloseIcon>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="mb-10">
            Choose the wallet you want to transfer your reward into it.
          </p>
          <div className="overflow-y-auto pr-4 mb-4">
            <Label label="Enter your wallet address">
              <Input
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address ? errors.address : ""}
              />
            </Label>
          </div>
          <FormErrors errors={{ ...errors }} />
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={cancel}
            name="return-btn"
          >
            cancel
          </Button>
          <Button
            variant={Button.variant.PRIMARY_LIGHT}
            type="submit"
            name="submit-btn"
            loading={isSubmitting}
            disabled={dirty && !isValid}
          >
            continue
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export const showChooseWalletModal = createModal(ChooseWalletModal);
