import { Box, createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import { useCallback } from "react";
import Container from "./Container";
import PostDetailModal from "./post/PostDetailModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heartContainer: {
      flex: "1 1 100%",
      // [theme.breakpoints.up("xs")]: {
      //   width: "100%",
      // },
      // (960px,infinity)
      [theme.breakpoints.up("md")]: {
        maxWidth: "740px",
      },
    },
    rightSideContainer: {
      display: "none",
      // width: "312px",
      flex: "0 0 312px",
      [theme.breakpoints.up("md")]: {
        display: "block",
      },
    },
    backToTopButton: {
      position: "sticky",
      top: "calc(100vh - 80px)",
      right: 0,
    },
  })
);

interface HomeContainerProps {
  mainContent: JSX.Element;
  rightSideContent?: JSX.Element;
}

const HomeContainer = ({
  mainContent,
  rightSideContent,
}: HomeContainerProps) => {
  const classes = useStyles();

  const backToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center">
        <Box className={classes.heartContainer}>{mainContent}</Box>
        <Box className={classes.rightSideContainer}>
          {rightSideContent}
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
      </Box>
      <PostDetailModal />
    </Container>
  );
};

export default HomeContainer;
