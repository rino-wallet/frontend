import React, { useState } from "react";
import * as yup from "yup";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { createModal } from "../ModalFactory";
import { useSelector, useSortErrors } from "../../hooks";
import { selectors as sessionSelectors } from "../../store/sessionSlice";
import { Modal } from "../Modal";
import { SuccessModal } from "../index";
import {
  Button, TextArea, Label,
} from "../../components";
import zammadApi from "../../api/zammad";
import { FormErrors } from "../FormErrors";

const validationSchema = yup.object().shape({
  title: yup.string().required("errors.required"),
  message: yup.string().required("errors.required"),
});

// const toDataURL = (file: File) => new Promise((resolve, reject) => {
//   const reader = new FileReader();
//   reader.onloadend = () => resolve(reader.result);
//   reader.onerror = reject;
//   reader.readAsDataURL(file);
// });

interface Props {
  cancel: () => void;
  submit: () => void;
}

export const SupportModal: React.FC<Props> = ({ cancel, submit }) => {
  // const [files, setFiles] = useState<File[]>([]);
  const { t } = useTranslation();
  const user = useSelector(sessionSelectors.getUser);
  const [isFinished, setIsFinished] = useState(false);

  const {
    nonFieldErrors,
    sortErrors,
  } = useSortErrors(["non_field_errors", "detail"]);
  const {
    // isValid,
    // dirty,
    handleSubmit,
    handleChange,
    // handleBlur,
    values,
    errors,
    touched,
    // isSubmitting,
  } = useFormik({
    validationSchema,
    initialValues: {
      title: `Customer Service Request From User ${user?.email} on ${format(new Date(), "dd/MM/yyyy")}`,
      message: "",
      non_field_errors: "",
    },
    onSubmit: async (formValues, { setErrors }) => {
      try {
        // const base64Image = files[0] ? await toDataURL(files[0]) : "";
        await zammadApi.createTicket({
          title: formValues.title,
          message: formValues.message,
        });
        setIsFinished(true);
      } catch (error: any) {
        if (error?.data) setErrors(sortErrors(error.data).fieldErrors);
      }
    },
  });

  return isFinished ? (
    <SuccessModal
      title="Issue Submitted"
      message="Thank you, we have successfully received your inquiry. You should receive an e-mail confirmation as well and we will get back to you as soon as we can!"
      goBackCallback={() => submit()}
    />
  ) : (
    <Modal size={Modal.size.BIG} title={t("layout.customer.service.title")}>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div>
            <p className="mb-5">
              {t("layout.customer.service.message")}
            </p>
            <div className="form-field">
              <Label label={t("layout.customer.service.label") as string}>
                <TextArea
                  placeholder={t("layout.customer.service.placeholder") as string}
                  onChange={handleChange}
                  name="message"
                  value={values.message}
                  error={touched.message ? t(errors.message || "") || "" : ""}
                />
              </Label>
            </div>
            {/* <div className="form-field">
              <UploadFile onChange={(f) => { setFiles(f); }} files={files} fileType="SCREENSHOT" />
            </div> */}
            <FormErrors errors={nonFieldErrors} />
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => cancel()}
            name="cancel-btn"
          >
            {t("common.cancel")}
          </Button>
          <Button
            name="submit-btn"
            type="submit"
            variant={Button.variant.PRIMARY_LIGHT}
          >
            {t("layout.customer.service.submit")}
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export const showSupportModal = createModal(SupportModal);
