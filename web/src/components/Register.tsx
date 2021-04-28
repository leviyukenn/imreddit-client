import {
  Button,
  createStyles,
  Grid,
  LinearProgress,
  Link,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MuiAlert from "@material-ui/lab/Alert";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import * as Yup from "yup";
import {
  RegularUserFragmentDoc,
  useRegisterMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { TextInputField } from "./InputField";
import { MODAL_CONTENT } from "./NavBar";

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface RegisterProps {
  onClose: () => void;
  setShowWhichContent: Dispatch<SetStateAction<MODAL_CONTENT>>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      width: theme.spacing(45),
      margin: "20px auto",
    },
    formItem: {
      width: "100%",
    },
  })
);

const Register = ({ onClose, setShowWhichContent }: RegisterProps) => {
  const [register, { error: registerError }] = useRegisterMutation({
    update(cache, { data: registerResponse }) {
      cache.modify({
        fields: {
          me() {
            if (!registerResponse?.register.user) {
              return null;
            }
            const registeredUserRef = cache.writeFragment({
              fragment: RegularUserFragmentDoc,
              data: registerResponse.register.user,
            });
            return registeredUserRef;
          },
        },
      });
    },
  });
  const [displayInnerError, setDisplayInnerError] = useState<boolean>(false);

  const onRegister = useCallback(
    async (values: FormData, actions: FormikHelpers<FormData>) => {
      const result = await register({ variables: values });

      if (registerError || result.errors) {
        setDisplayInnerError(true);
        return;
      }
      if (result.data?.register.errors) {
        actions.setErrors(toErrorMap(result.data?.register.errors));
        return;
      } else if (result.data?.register.user) {
        onClose();
      }
    },
    [register, setDisplayInnerError]
  );

  const goToLoginModal = useCallback(() => {
    setShowWhichContent(MODAL_CONTENT.LOGIN);
  }, [setShowWhichContent]);

  const classes = useStyles();
  return (
    <Formik
      initialValues={{ username: "", password: "", email: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .min(3, "Username must be between 3 and 20 characters")
          .max(20, "Username must be between 3 and 20 characters")
          .matches(
            /^\w+$/,
            "Letters, numbers, underscores only. Please try again without symbols."
          )
          .required("Required"),
        email: Yup.string().email("Must be a valid email").required("Required"),
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
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            className={classes.formContainer}
            spacing={3}
          >
            <Grid item className={classes.formItem}>
              {displayInnerError ? (
                <MuiAlert elevation={6} variant="filled" severity="error">
                  Inner error.Please try it again later.
                </MuiAlert>
              ) : null}
            </Grid>

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
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item className={classes.formItem}>
              <Typography variant="caption">
                Already has a account?{" "}
                <Link onClick={goToLoginModal}>LOG IN</Link>
              </Typography>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
export default Register;
