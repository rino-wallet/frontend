import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { format } from "date-fns";
import { createModal } from "promodal";
import { Subaddress, UpdateSubaddressThunkPayload } from "../../../types";
import { FormErrors, Modal } from "../../../modules/index";
import { Button, Label, Input } from "../../../components";

const validationSchema = yup.object().shape({
  label: yup.string().max(100, "Ensure this field has no more than 100 characters."),
});

interface Props {
  id: string;
  address: string;
  label?: string;
  submit: () => void;
  updateSubaddress: (data: UpdateSubaddressThunkPayload) => Promise<Subaddress>;
}

const EditLabelModal: React.FC<Props> = ({
  id, address, label, submit, updateSubaddress,
}) => {
  const {
    isValid,
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
      label: label || format(new Date(), "yyyy-MM-dd HH:mm"),
      non_field_errors: "",
      detail: "",
    },
    onSubmit: async (formValues, { setErrors }): Promise<void | Subaddress> => {
      try {
        const response = await updateSubaddress({ id, address, label: formValues.label });
        submit();
        return response;
      } catch (err: any) {
        if (err) setErrors(err);
      }
    },
  });
  return (
    <Modal showCloseIcon title="Receiving Address editing" onClose={submit}>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="form-field">
            <Label label="Label">
              <Input
                type="text"
                name="label"
                value={values.label}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Label"
                error={touched.label ? errors.label || "" : ""}
              />
            </Label>
          </div>
          <div className="form-field">
            <Label label="receiving address">
              <div className="theme-text-secondary break-all">
                {address}
              </div>
            </Label>
          </div>
          <FormErrors errors={errors} />
        </Modal.Body>
        <Modal.Actions>
          <div className="flex justify-end space-x-3 whitespace-nowrap">
            <Button
              disabled={isSubmitting}
              type="button"
              name="cancel-btn"
              onClick={submit}
            >
              Cancel
            </Button>
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              name="submit-btn"
              loading={isSubmitting}
            >
              Save
            </Button>
          </div>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export const editLabelModal = createModal(EditLabelModal);
