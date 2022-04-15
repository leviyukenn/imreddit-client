import { useCallback } from "react";
import { FrontendError } from "../../const/errors";
import { useLeaveCommunityMutation } from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { AlertSeverity } from "../../redux/types/types";

export function useLeaveCommunity() {
  const { onOpenSnackbarAlert, handleMutationError } = useSnackbarAlert();

  const [leave, { loading }] = useLeaveCommunityMutation({
    onError: handleMutationError,
  });

  const leaveCommunity = useCallback(
    async (communityName: string) => {
      const leaveCommunityResponse = await leave({
        variables: { communityName },
      });
      const userRole = leaveCommunityResponse?.data?.leaveCommunity;
      if (userRole?.isMember === false) {
        onOpenSnackbarAlert({
          message: `Successfully left r/${userRole.community.name}`,
          severity: AlertSeverity.SUCCESS,
        });
        return true;
      }

      onOpenSnackbarAlert({
        message: FrontendError.ERR0002,
        severity: AlertSeverity.ERROR,
      });
      return false;
    },
    [leave, onOpenSnackbarAlert]
  );

  return {
    leaveCommunity,
    loading,
  };
}
