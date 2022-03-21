import React from "react";
import LoginRegisterLayout from "../LoginRegisterLayout";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <LoginRegisterLayout titleText={"Reset your password"}>
      <ForgotPasswordForm />
    </LoginRegisterLayout>
  );
};
export default ForgotPassword;
