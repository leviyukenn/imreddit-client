import { useCallback } from "react";
import { useEditUserNameMutation } from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { AlertSeverity } from "../../redux/types/types";
import { useIsAuth } from "../../utils/hooks/useIsAuth";

export const useSaveUserName = () => {
  const { onOpenSnackbarAlert, handleMutationError } = useSnackbarAlert();
  const [saveUserNameMutation, { loading }] = useEditUserNameMutation({
    onError: handleMutationError,
  });
  const { checkIsAuth } = useIsAuth();
  const onSaveUserName = useCallback(
    async (username: string) => {
      if (!checkIsAuth) return false;
      const result = await saveUserNameMutation({
        variables: { username },
      });
      if (!result) {
        return false;
      }

      if (result.errors) {
        onOpenSnackbarAlert({
          message: result.errors[0].message,
          severity: AlertSeverity.ERROR,
        });
        return false;
      }

      const userResponse = result.data?.editUserName;
      if (userResponse?.errors) {
        onOpenSnackbarAlert({
          message: userResponse.errors[0].message,
          severity: AlertSeverity.ERROR,
        });
        return false;
      }

      if (userResponse?.user) {
        onOpenSnackbarAlert({
          message: `User settings updated successfully`,
          severity: AlertSeverity.SUCCESS,
        });
        return true;
      }
      return false;
    },
    [saveUserNameMutation]
  );

  return {
    onSaveUserName,
    loading,
  };
};
