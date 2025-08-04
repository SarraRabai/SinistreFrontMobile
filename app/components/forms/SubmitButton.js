import React from "react";
import { useFormikContext } from "formik";
import AppButton from "../AppButton";

function SubmitButton({ title }) {
  const { handleSubmit } = useFormikContext();
  return <AppButton color="ctama2" title={title} onPress={handleSubmit} />;
}

export default SubmitButton;
