import { Button, CircularProgress, createStyles, Divider, Grid, LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { Field, Form, Formik } from "formik";
import React from "react";
import { createCommunityValidationSchema } from "../../fieldValidateSchema/fieldValidateSchema";
import { useCreateCommunity } from "../../graphql/hooks/useCreateCommunity";
import { useTopics } from "../../graphql/hooks/useTopics";
import { SelectField, TextAreaField, TextInputField } from "../InputField";

interface FormData {
  name: string;
  description: string;
  topicIds: string[];
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
    submitButtonWrap: {
      position: "relative",
    },
    buttonProgress: {
      color: blue[500],
    },
  })
);


const CreateCommunityForm = () => {

  const { onCreateCommunity, loading } = useCreateCommunity();
  const { topics } = useTopics();

  const classes = useStyles();
  return (
    <>
      <Formik<FormData>
        initialValues={{ name: "", description: "", topicIds: [] }}
        validationSchema={createCommunityValidationSchema}
        onSubmit={onCreateCommunity}
      >
        {({ submitForm, isSubmitting, values }) => (
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
              spacing={6}
            >
              <Grid item className={classes.formItem}>
                <Typography
                  variant="h5"
                  display="block"
                  gutterBottom
                  color="textPrimary"
                >
                  Create Community
                </Typography>
                <Divider variant="fullWidth" />
              </Grid>
              <Grid item className={classes.formItem}>
                <Field
                  component={TextInputField}
                  name="name"
                  type="name"
                  label="Name"
                />
              </Grid>

              <Grid item className={classes.formItem}>
                <SelectField name="topicIds" label="Topics" options={topics} />
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  color="textSecondary"
                >
                  This will help relevant users find your community.
                  {`${values.topicIds.length}/${topics.length}`}
                </Typography>
              </Grid>
              <Grid item className={classes.formItem}>
                <Field
                  component={TextAreaField}
                  name="description"
                  type="description"
                  label="Description"
                />
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  color="textSecondary"
                >
                  This is how new members come to understand your community.
                </Typography>
              </Grid>
              {isSubmitting && <LinearProgress />}
              <br />
              <Grid item className={classes.formItem}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={submitForm}
                  startIcon={
                    loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )
                  }
                >
                  Create Community
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default CreateCommunityForm;
