import * as yup from "yup";

export const passwordValidationSchema = yup.string()
  .min(10, "This password is too short. It must contain at least 10 characters.")
  .matches(/^(?=.*?[A-Za-z])(?=.*?[0-9])/, "The password should contain numbers and characters.")
  .when("email", {
    is: (email: string) => !!email,
    then: yup.string().notOneOf([yup.ref("email")], "Make sure the password is not similar to email."),
  })
  .required("This field is required.");
