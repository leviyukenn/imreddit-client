import {
  Button,
  CircularProgress,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { blue } from "@material-ui/core/colors";
import DoneIcon from "@material-ui/icons/Done";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useState } from "react";
import { forgotPasswordValidationSchema } from "../../fieldValidateSchema/fieldValidateSchema";
import { useForgotPassword } from "../../graphql/hooks/useForgotPassword";
import { useUserModalState } from "../../redux/hooks/useUserModalState";
import { TextInputField } from "../InputField";

interface FormData {
  email: string;
}

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

const ForgotPasswordForm = () => {
  const {
    isOpen,
    showLoginModal,
    showRegisterModal,
    showLoginPage,
    showRegisterPage,
  } = useUserModalState();

  const classes = useStyles();

  const { onForgotPassword } = useForgotPassword();
  const [completeSendingEmail, setCompleteSendingEmail] = useState(false);

  const onSubmit = useCallback(
    async (values: FormData, actions: FormikHelpers<FormData>) => {
      const result = await onForgotPassword(values.email);

      if (result.success) {
        actions.resetForm();
        setCompleteSendingEmail(true);
      }

      if (result.errors) actions.setErrors(result.errors);
    },
    [onForgotPassword, setCompleteSendingEmail]
  );

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={forgotPasswordValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isSubmitting }) => (
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
            <br />
            <Grid item className={classes.formItem}>
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting || completeSendingEmail}
                onClick={submitForm}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  ) : completeSendingEmail ? (
                    <DoneIcon />
                  ) : null
                }
              >
                Reset Password
              </Button>
            </Grid>
            <Grid item className={classes.formItem}>
              <Breadcrumbs separator="-" aria-label="breadcrumb">
                <Typography variant="caption">
                  <Link
                    color="primary"
                    href="#"
                    onClick={isOpen ? showLoginModal : showLoginPage}
                  >
                    LOG IN
                  </Link>
                </Typography>
                <Typography variant="caption">
                  <Link
                    color="primary"
                    href="#"
                    onClick={isOpen ? showRegisterModal : showRegisterPage}
                  >
                    SIGN UP
                  </Link>
                </Typography>
              </Breadcrumbs>
            </Grid>
            {completeSendingEmail ? (
              <Grid item className={classes.formItem}>
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Thanks! If your email address is correct, you'll get an email
                  with a link to reset your password shortly.
                </Alert>
              </Grid>
            ) : null}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
export default ForgotPasswordForm;
