import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Input } from "../../../components";
import { FormErrors } from "../../../modules/index";

const validationSchema = yup.object().shape({
  code: yup.string().required("This field is required."),
});

interface Props {
  onSubmit: (payload: { code: string }) => Promise<any>;
  disabled: boolean;
}

export const PromotionForm = ({ onSubmit, disabled }: Props) => {
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
      code: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        await onSubmit({ code: formValues.code });
      } catch (err: any) {
        setErrors(err);
      }
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-3 mb-4">
        <div className="w-full">
          <Input
            type="text"
            name="code"
            value={values.code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.code ? errors.code : ""}
            disabled={disabled}
          />
        </div>
        <div>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid || disabled}
            loading={isSubmitting}
            variant={Button.variant.PRIMARY_LIGHT}
          >
            Apply
          </Button>
        </div>
      </div>
      {disabled && "Compleet and redeem your promotions to add a new one"}
      <FormErrors errors={errors} />
    </form>
  );
};
