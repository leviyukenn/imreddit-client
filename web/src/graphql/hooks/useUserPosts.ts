import { useMemo } from "react";
import {
  RegularPostDetailFragment,
  useUserPostsQuery,
} from "../../generated/graphql";

export function useUserPosts(userName: string) {
  const response = useUserPostsQuery({
    skip: typeof window === "undefined",
    variables: { limit: 10, userName },
  });

  const posts: RegularPostDetailFragment[] = useMemo(
    () => response.data?.userPosts.posts || [],
    [response]
  );

  const hasMore = useMemo(
    () => (response.data?.userPosts ? response.data.userPosts.hasMore : false),
    [response]
  );
  const next = () => {
    try {
      response.fetchMore({
        variables: {
          limit: 10,
          cursor: posts[posts.length - 1]?.createdAt,
        },
      });
    } catch (e) {}
  };

  return { posts, hasMore, next, loading: response.loading };
}
