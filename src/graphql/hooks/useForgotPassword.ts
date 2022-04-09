import { useCallback } from "react";
import { useForgotPasswordMutation } from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { toErrorMap } from "../../utils/toErrorMap";

export function useForgotPassword() {
  const { handleMutationError } = useSnackbarAlert();
  const [forgotPassword, { loading }] = useForgotPasswordMutation({
    onError: handleMutationError,
  });

  const onForgotPassword = useCallback(
    async (
      email: string
    ): Promise<{ success: boolean; errors?: Record<string, string> }> => {
      const response = await forgotPassword({ variables: { email } });
      const result = response?.data?.forgotPassword;

      if (result?.isComplete) {
        return { success: true };
      }

      if (result?.errors) {
        return { success: false, errors: toErrorMap(result.errors) };
        // actions.setErrors(toErrorMap(result.errors));
        // return;
      }
      return { success: false };
    },
    [forgotPassword]
  );

  return {
    onForgotPassword,
    loading
  };
}
