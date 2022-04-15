import { useMemo } from "react";
import { useUserRoleQuery } from "../../generated/graphql";
import { useIsAuth } from "../../utils/hooks/useIsAuth";

export function useUserCommunityRole(communityName?: string) {
  const { me, meLoading } = useIsAuth();
  const { data: userRoleResponse, loading, refetch } = useUserRoleQuery({
    skip: typeof window === "undefined" || !me?.username || !communityName,
    variables: { userName: me?.username!, communityName: communityName! },
  });

  const userRole = useMemo(() => userRoleResponse?.userRole, [
    userRoleResponse,
  ]);

  return { userRole, refetch, loading: meLoading || loading };
}
