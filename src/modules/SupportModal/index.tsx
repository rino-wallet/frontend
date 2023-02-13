import React, { useState } from "react";
import * as yup from "yup";
import { format } from "date-fns";
import { useFormik } from "formik";
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
  title: yup.string().required("This field is required."),
  message: yup.string().required("This field is required."),
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
      title: `Customer Service Request From User ${user?.username} on ${format(new Date(), "dd/MM/yyyy")}`,
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
    <Modal size={Modal.size.BIG} title="RINO Customer Service">
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div>
            <p className="mb-5">
              RINO team is happy to help with any issue you might encounter. Just type your inquiry below and we&apos;ll do our best to get back to you in 24 hours.
            </p>
            <div className="form-field">
              <Label label="Message">
                <TextArea
                  placeholder="Please describe your problem with RINO"
                  onChange={handleChange}
                  name="message"
                  value={values.message}
                  error={touched.message ? errors.message : ""}
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
            Cancel
          </Button>
          <Button
            name="submit-btn"
            type="submit"
            variant={Button.variant.PRIMARY_LIGHT}
          >
            Submit issue
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export const showSupportModal = createModal(SupportModal);
