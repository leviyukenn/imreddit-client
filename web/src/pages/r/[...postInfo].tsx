import { Box, createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import Container from "../../components/Container";
import { LoadingPostCard } from "../../components/post/PostCard";
import PostDetail from "../../components/post/PostDetail";
import { CommunityPostsInfiniteScroll } from "../../components/post/PostInfiniteScroll";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContentHeart: {
      marginTop: "24px",
      maxWidth: "740px",
      width: "calc(100% - 32px)",
    },
    backToTopButton: {
      position: "sticky",
      top: "calc(100vh - 80px)",
      right: 0,
    },
  })
);

const CommunityHome = () => {
  const classes = useStyles();
  const router = useRouter();

  const backToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const communityName = useMemo(
    () => ((router.query.postInfo as string[]) || [])[0] || "",
    [router]
  );
  const postId = useMemo(
    () => ((router.query.postInfo as string[]) || [])[1] || "",
    [router]
  );
  const modalPostId = useMemo(() => router.query.postId as string, [router]);
  debugger;

  return (
    <Container>
      {postId && !modalPostId ? (
        <PostDetail postId={postId} />
      ) : (
        <Box display="flex" justifyContent="center">
          {communityName ? (
            <CommunityPostsInfiniteScroll communityName={communityName} />
          ) : (
            <LoadingPostCard />
          )}
          <Fab
            variant="extended"
            color="primary"
            onClick={backToTop}
            className={classes.backToTopButton}
          >
            <NavigationIcon />
            Back to Top
          </Fab>
        </Box>
      )}
    </Container>
  );
};

export default CommunityHome;
