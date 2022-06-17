import * as yup from "yup";

// override email regex
yup.addMethod<yup.StringSchema>(yup.string, "email", function validate() {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return this.matches(emailRegex, "Please enter a valid email.");
});
