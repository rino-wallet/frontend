import { Formik } from "formik";
import classNames from "classnames";
import * as yup from "yup";
import React, { useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useThunkActionCreator, useIsMobile } from "../../../hooks";
import {
  updateSubaddress as updateSubaddressThunk,
} from "../../../store/subaddressListSlice";
import { Button } from "../../../components";
import { FormErrors } from "../../../modules/index";
import { Subaddress } from "../../../types";
import { editLabelModal } from "./EditLabelModal";

interface Props {
  id: string;
  address: string;
  className?: string;
  label?: string;
  block?: boolean;
  short?: boolean;
}

const validationSchema = yup.object().shape({
  label: yup.string().max(100, "wallet.receive.error.label"),
});

export const EditLabelForm: React.FC<Props> = ({
  label, block, id, address, className = "", short,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const updateSubaddress = useThunkActionCreator(updateSubaddressThunk);
  const [isEditing, setIsEditing] = useState(false);
  function onEdit(): void {
    if (isMobile) {
      editLabelModal({
        id, label, address, updateSubaddress,
      });
    } else {
      setIsEditing(true);
    }
  }
  return isEditing ? (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        label: label || format(new Date(), "yyyy-MM-dd HH:mm"),
        non_field_errors: "",
        detail: "",
      }}
      onSubmit={async (values, { setErrors }): Promise<void | Subaddress> => {
        try {
          const response = await updateSubaddress({ id, address, label: values.label });
          setIsEditing(false);
          return response;
        } catch (err: any) {
          if (err) setErrors(err);
        }
      }}
    >
      {
        ({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          isValid,
          isSubmitting,
        }): React.ReactChild => (
          <form className={classNames("items-center", className, { block, "inline-block": !block })} onSubmit={handleSubmit}>
            <div className="flex items-center">
              <Button
                loading={isSubmitting}
                type="submit"
                className="mr-2"
                size={Button.size.TINY}
                disabled={!isValid}
                name="save-label"
              >
                {short ? t("wallet.receive.save") : t("wallet.receive.save-label")}
              </Button>
              <input
                className={classNames("shadow-none outline-none focus:outline-none focus:ring-0 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2", {
                  "flex-1": block,
                })}
                style={{ borderColor: "rgba(105, 98, 169, 0.6)", color: "rgba(105, 98, 169, 1)", marginBottom: "-2px" }}
                value={values.label}
                onChange={handleChange}
                onBlur={handleBlur}
                name="label"
                type="text"
              />
            </div>
            <div>
              <FormErrors fields={["label"]} errors={errors} />
            </div>
          </form>
        )
      }
    </Formik>
  ) : (
    <div className={classNames("items-start", className, { flex: block, "inline-flex": !block })}>
      <Button
        onClick={onEdit}
        className="mr-2 whitespace-nowrap shrink-0 relative top-0.25"
        size={Button.size.TINY}
        name={label ? t("wallet.receive.edit-label") as string : t("wallet.receive.add.label") as string}
      >
        { label ? (short ? t("wallet.receive.edit") : t("wallet.receive.edit-label")) : t("wallet.receive.add.label") }
      </Button>
      {" "}
      <div className="font-bold text-ellipsis min-w-0 overflow-hidden">{label}</div>
    </div>
  );
};
