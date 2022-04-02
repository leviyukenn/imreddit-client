import {
  Box,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField, TextFieldProps } from "formik-material-ui";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { editUserNameValidationSchema } from "../../../fieldValidateSchema/fieldValidateSchema";
import { useSaveUserName } from "../../../graphql/hooks/useEditUserName";
import { useAlertDialog } from "../../../redux/hooks/useAlertDialog";
import { createUserProfileLink } from "../../../utils/links";

interface UserNameEditorProps {
  username: string;
  closeUserNameEditor: () => void;
}
interface FormData {
  username: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fieldContainer: {
      border: "1px solid #0079d3",
      borderRadius: "4px",
      backgroundColor: "#f6f7f8",
      padding: "1em 1em 0 1em",
    },
    field: {
      width: "100%",
      padding: 0,
      marginBottom: "1em",
    },
    inputBase: {
      fontSize: "0.875rem",
      fontWeight: 400,
      padding: 0,
    },
    remainingText: {
      flex: 1,
      color: "#7c7c7c",
    },
    cancelButton: {
      color: "#ff0000",
      textTransform: "none",
      fontWeight: 700,
      padding: 0,
      minWidth: "48px",
    },
    saveButton: {
      textTransform: "none",
      fontWeight: 700,
      padding: 0,
      minWidth: "48px",
    },
  })
);

const UserNameEditor = ({
  username,
  closeUserNameEditor,
}: UserNameEditorProps) => {
  const classes = useStyles();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const { open: openAlertDialog, close: closeAlertDialog } = useAlertDialog({
    title: "Discard unsaved changes before leaving?",
    text:
      "You have made some changes to your profile, do you wish to leave this editor without saving?",
    confirmButtonName: "Discard",
    onConfirm: () => {
      closeAlertDialog();
      closeUserNameEditor();
    },
  });

  const { onSaveUserName, loading } = useSaveUserName();
  const router = useRouter();

  const handleSave = useCallback(
    async (values: FormData) => {
      const success = await onSaveUserName(values.username);

      if (success) {
        // closeUserNameEditor();
        router.push(createUserProfileLink(values.username, "posts"));
      }
    },
    [onSaveUserName, closeUserNameEditor]
  );

  //   const onSaveDescription = useCallback(() => {
  //     callback;
  //   }, [input]);
  //   const remainingCharacterNumber = 300 - values.description.length;

  return (
    <>
      <Formik<FormData>
        initialValues={{ username }}
        validationSchema={editUserNameValidationSchema}
        onSubmit={handleSave}
      >
        {({ submitForm, values, handleBlur }) => (
          <Form>
            <Box className={classes.fieldContainer}>
              <Field
                component={TextAreaField}
                name="username"
                type="username"
                onBlur={(
                  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  if (isButtonClicked) {
                    return;
                  }
                  if (username === values.username) {
                    closeUserNameEditor();
                    handleBlur(e);
                    return;
                  }
                  openAlertDialog();
                  handleBlur(e);
                }}
              />
              <Box display="flex" alignItems="center">
                <Typography variant="caption" className={classes.remainingText}>
                  {values.username.length >= 3
                    ? `${20 - values.username.length} Characters remaining`
                    : "At least 3 characters needed"}
                </Typography>
                <Button
                  size="small"
                  className={classes.cancelButton}
                  onClick={closeUserNameEditor}
                  onMouseDown={() => setIsButtonClicked(true)}
                  onMouseUp={() => setIsButtonClicked(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  color="primary"
                  disabled={loading}
                  onClick={submitForm}
                  className={classes.saveButton}
                  onMouseDown={() => setIsButtonClicked(true)}
                  onMouseUp={() => setIsButtonClicked(false)}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};
const TextAreaField = ({ children, ...props }: TextFieldProps) => {
  const classes = useStyles();

  return (
    <TextField
      autoFocus
      inputProps={{ maxLength: 20 }}
      {...props}
      className={classes.field}
      InputProps={{
        className: classes.inputBase,
        disableUnderline: true,
      }}
    >
      {children}
    </TextField>
  );
};

export default UserNameEditor;
