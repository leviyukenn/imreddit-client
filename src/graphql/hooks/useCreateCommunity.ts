import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useCreateCommunityMutation } from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { useIsAuth } from "../../utils/hooks/useIsAuth";
import { createCommunityHomeLink } from "../../utils/links";
import { toErrorMap } from "../../utils/toErrorMap";

export interface CreateCommunityFormData {
  name: string;
  description: string;
  topicIds: string[];
}

export const useCreateCommunity = () => {
  const { onOpenSnackbarAlert, handleMutationError } = useSnackbarAlert();
  const [createCommunity] = useCreateCommunityMutation({
    onError: handleMutationError,
  });
  const router = useRouter();
  const { redirectToLoginIfNotLoggedIn } = useIsAuth();
  const [loading, setLoading] = useState(false);

  const onCreateCommunity = useCallback(
    async (
      values: CreateCommunityFormData,
      actions: FormikHelpers<CreateCommunityFormData>
    ) => {
      redirectToLoginIfNotLoggedIn();
      setLoading(true);
      const response = await createCommunity({ variables: values });

      const createCommunityResult = response?.data?.createCommunity;

      if (createCommunityResult?.community) {
        router.push(
          createCommunityHomeLink(createCommunityResult.community.name)
        );
        return true;
      }

      if (createCommunityResult?.errors) {
        actions.setErrors(toErrorMap(createCommunityResult.errors));
      }

      setLoading(false);
      return false;
    },
    [
      setLoading,
      redirectToLoginIfNotLoggedIn,
      createCommunity,
      onOpenSnackbarAlert,
    ]
  );

  return {
    onCreateCommunity,
    loading,
  };
};
