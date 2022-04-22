import { useCallback } from "react";
import { useUploadImageMutation } from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { AlertSeverity } from "../../redux/types/types";
import { toErrorMap } from "../../utils/toErrorMap";
import { MutationResult } from "../types/types";

export function useUploadImage() {
  const { onOpenSnackbarAlert, handleMutationError } = useSnackbarAlert();
  const [uploadImage, { loading }] = useUploadImageMutation({
    onError: handleMutationError,
  });

  const onUpload = useCallback(
    async (file: File): Promise<MutationResult<string>> => {
      const response = await uploadImage({ variables: { file } });

      const uploadedImageResponse = response?.data?.uploadImage;
      if (uploadedImageResponse?.path) {
        onOpenSnackbarAlert({
          message: "Image successfully uploaded.",
          severity: AlertSeverity.SUCCESS,
        });
        return { success: true, data: uploadedImageResponse.path };
      }

      if (uploadedImageResponse?.errors) {
        onOpenSnackbarAlert({
          message: uploadedImageResponse?.errors[0].message,
          severity: AlertSeverity.ERROR,
        });
        return {
          success: false,
          errors: toErrorMap(uploadedImageResponse.errors),
        };
      }

      return {
        success: false,
      };
    },
    [uploadImage, onOpenSnackbarAlert]
  );

  return { onUpload, loading };
}
