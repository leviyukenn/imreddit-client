import {
  Button,
  CircularProgress,
  createStyles,
  Grid,
  LinearProgress,
  Link,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { registerValidationSchema } from "../../fieldValidateSchema/fieldValidateSchema";
import { RegisterFormData, useRegister } from "../../graphql/hooks/useRegister";
import { useUserModalState } from "../../redux/hooks/useUserModalState";
import { TextInputField } from "../InputField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      width: "100%",
      margin: "20px auto",
    },
    formItem: {
      width: "100%",
      marginBottom: "1.25rem",
      "& input": {
        boxSizing: "border-box",
        height: 48,
        fontSize: "0.875rem",
        padding: "1.375rem 0.75rem 0.625rem",
      },
      "& label": {
        fontSize: "0.875rem",
      },
    },
    buttonProgress: {
      color: blue[500],
    },
  })
);

interface RegisterFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

const RegisterForm = ({ isSubmitting, setIsSubmitting }: RegisterFormProps) => {
  const {
    isOpen,
    onClose,
    showLoginModal,
    showLoginPage,
  } = useUserModalState();

  const { onRegister, loading } = useRegister();
  const router = useRouter();

  const onSubmit = useCallback(
    async (
      values: RegisterFormData,
      actions: FormikHelpers<RegisterFormData>
    ) => {
      setIsSubmitting(true);
      const result = await onRegister(values);
      if (result.success) {
        if (isOpen) {
          onClose();
          return;
        }
        router.back();
        return;
      }
      if (result.errors) actions.setErrors(result.errors);
      setIsSubmitting(false);
    },
    [onRegister, isOpen, onClose, router, setIsSubmitting]
  );

  const classes = useStyles();
  return (
    <Formik
      initialValues={{ username: "", password: "", email: "" }}
      validationSchema={registerValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => (
        <Form
          onKeyPress={(event) => {
            if (event.key === "Enter") submitForm();
          }}
        >
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            className={classes.formContainer}
          >
            <Grid item className={classes.formItem}>
              <Field
                component={TextInputField}
                name="email"
                type="email"
                label="EMAIL"
              />
            </Grid>

            <Grid item className={classes.formItem}>
              <Field
                component={TextInputField}
                name="username"
                type="text"
                label="USERNAME"
              />
            </Grid>
            <Grid item className={classes.formItem}>
              <Field
                component={TextInputField}
                type="password"
                label="PASSWORD"
                name="password"
              />
            </Grid>
            {isSubmitting && <LinearProgress />}
            <br />
            <Grid item className={classes.formItem}>
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                startIcon={
                  isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )
                }
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item className={classes.formItem}>
              <Typography variant="caption">
                Already has a account?{" "}
                <Link onClick={isOpen ? showLoginModal : showLoginPage}>
                  LOG IN
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
export default RegisterForm;
