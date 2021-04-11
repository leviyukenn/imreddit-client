import { Alert, AlertIcon, Box, Button } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { PasswordInputField, TextInputField } from "../components/InputField";
import * as Yup from "yup";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

interface FormData {
  username: string;
  password: string;
}

const register = ({}: registerProps) => {
  const [, register] = useRegisterMutation();
  const [displayInnerError, setDisplayInnerError] = useState<boolean>(false);
  const router = useRouter();

  const onRegister = useCallback(
    async (values: FormData, actions: FormikHelpers<FormData>) => {
      const result = await register(values);
      console.log(result.error);
      if (result.error) {
        setDisplayInnerError(true);
        return;
      }
      if (result.data?.register.errors) {
        actions.setErrors(toErrorMap(result.data?.register.errors));
        return;
      } else if (result.data?.register.user) {
        router.push("/");
      }
    },
    [register, setDisplayInnerError, router]
  );
  return (
    <Box maxW="400px" mx="auto" mt="50px">
      {displayInnerError ? (
        <Alert status="error">
          <AlertIcon />
          Inner error.Please try it again later.
        </Alert>
      ) : null}

      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string()
            .min(3, "Username must be between 3 and 20 characters")
            .max(20, "Username must be between 3 and 20 characters")
            .matches(
              /^\w+$/,
              "Letters, numbers, underscores only. Please try again without symbols."
            )
            .required("Required"),
          password: Yup.string()
            .min(4, "Password must be at least 4 characters long")
            .matches(
              /^\w+$/,
              "Letters, numbers, underscores only. Please try again without symbols."
            )
            .required("Required"),
        })}
        onSubmit={onRegister}
      >
        {(formik) => (
          <Form>
            <TextInputField label="username" name="username" />
            <PasswordInputField label="password" name="password" />
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={formik.isSubmitting}
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
export default register;
