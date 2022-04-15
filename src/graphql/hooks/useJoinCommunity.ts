import { Reference } from "@apollo/client";
import { useCallback } from "react";
import { FrontendError } from "../../const/errors";
import { useJoinCommunityMutation } from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { AlertSeverity } from "../../redux/types/types";

export function useJoinCommunity() {
  const { onOpenSnackbarAlert, handleMutationError } = useSnackbarAlert();

  const [join, { loading }] = useJoinCommunityMutation({
    onError: handleMutationError,
    update(cache, { data: roleResponse }) {
      cache.modify({
        fields: {
          userRoles(
            existing: Reference[],
            { storeFieldName, toReference, readField }
          ) {
            const userRole = roleResponse?.joinCommunity;
            if (!userRole) {
              return existing;
            }

            if (!storeFieldName.includes(userRole.userId)) {
              return existing;
            }

            const existingUserRole = existing.find(
              (userRoleRef) =>
                readField("userId", userRoleRef) === userRole.userId &&
                readField("communityId", userRoleRef) === userRole.communityId
            );
            if (existingUserRole) {
              return existing;
            }

            return [...existing, toReference(userRole)];
          },
        },
      });
    },
  });

  const joinCommunity = useCallback(
    async (communityName: string) => {
      const joinCommunityResponse = await join({
        variables: { communityName },
      });
      const userRole = joinCommunityResponse?.data?.joinCommunity;
      if (userRole?.isMember) {
        onOpenSnackbarAlert({
          message: `Successfully joined r/${userRole.community.name}`,
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
    [join, onOpenSnackbarAlert]
  );

  return {
    joinCommunity,
    loading,
  };
}
