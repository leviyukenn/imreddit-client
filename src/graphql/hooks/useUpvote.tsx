import { useCallback, useMemo } from "react";
import { VoteStatus } from "../../components/types/types";
import { useGetMyUpvoteQuery, useVoteMutation } from "../../generated/graphql";
import { useSnackbarAlert } from "../../redux/hooks/useSnackbarAlert";
import { useIsAuth } from "../../utils/hooks/useIsAuth";

enum VoteType {
  UPVOTE = 1,
  DOWNVOTE = -1,
}

export function useVote(post: { __typename?: string; id: string }) {
  const { checkIsAuth, meLoading, me } = useIsAuth();
  const { handleMutationError } = useSnackbarAlert();
  const [vote, { loading: voteLoading }] = useVoteMutation({
    onError: handleMutationError,
    update(cache, { data: voteResponse }) {
      if (!voteResponse) return;
      cache.modify({
        id: cache.identify(post),
        fields: {
          points(existing: number) {
            if (!voteResponse) return existing;
            return existing + voteResponse.vote.points;
          },
        },
      });
    },
  });
  const { data: myUpvoteResponse, refetch } = useGetMyUpvoteQuery({
    skip: !me?.id,
    variables: { postId: post.id, userId: me?.id! },
  });

  const voteStatus = useMemo(() => {
    const myUpvoteValue = myUpvoteResponse?.getUpvote?.value;
    if (!myUpvoteValue) return VoteStatus.NOTVOTED;
    if (myUpvoteValue === 1) return VoteStatus.UPVOTED;
    return VoteStatus.DOWNVOTED;
  }, [myUpvoteResponse]);

  const onVote = useCallback(
    async (value) => {
      if (!checkIsAuth()) return false;
      const voteResponse = await vote({
        variables: { postId: post.id, value },
      });

      const savedUpvote = voteResponse?.data?.vote.upvote;

      if (savedUpvote) {
        refetch({ postId: savedUpvote.postId, userId: savedUpvote.userId });
        return true;
      }
      return false;
    },
    [vote, checkIsAuth, post, refetch]
  );

  const onUpvote = useCallback(() => {
    onVote(VoteType.UPVOTE);
  }, [onVote]);

  const onDownvote = useCallback(() => {
    onVote(VoteType.DOWNVOTE);
  }, [onVote]);

  return {
    voteStatus,
    loading: voteLoading || meLoading,
    onUpvote,
    onDownvote,
  };
}
