import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import CakeIcon from "@material-ui/icons/Cake";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { RegularCommunityFragment } from "../../../generated/graphql";
import { createPostLink } from "../../../utils/links";
import CommunityJoinLeaveButton from "../CommunityJoinLeaveButton";

interface CommunityDescriptionProps {
  community: RegularCommunityFragment;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#edeff1",
      border: "1px solid #bdbfc0",
      borderRadius: 4,
    },
    headerRoot: {
      backgroundColor: "#373c3f",
      padding: "0.75rem",
    },
    title: {
      fontSize: "0.875rem",
      fontWeight: 700,
      color: "#fff",
    },
    totalMemberships: {
      marginTop: "1em",
      lineHeight: "1em",
    },
    createdDateContainer: {
      display: "flex",
      marginTop: "1.5em",
    },
    createdDate: {
      marginLeft: "0.5em",
    },
    createPostButton: {
      borderRadius: "9999px",
      fontWeight: 700,
      textTransform: "none",
      marginTop: 12,
    },
    actions: {
      flexDirection: "column",
    },
    joinButton: {
      marginTop: 16,
      width: "100%",
    },
  })
);

const CommunityDescription = ({ community }: CommunityDescriptionProps) => {
  const classes = useStyles();
  const router = useRouter();

  const goToCreatePost = useCallback(() => {
    router.push(createPostLink);
  }, [router]);

  return (
    <Card className={classes.root}>
      <CardHeader
        title={"About Community"}
        classes={{ root: classes.headerRoot, title: classes.title }}
      />
      <CardContent>
        <Typography variant="body2" component="p">
          {community.description}
        </Typography>
        <Typography
          variant="h6"
          component="p"
          className={classes.totalMemberships}
        >
          {community.totalMemberships}
        </Typography>
        <Typography variant="subtitle2" component="p" gutterBottom>
          Memberships
        </Typography>
        <Box display="flex" className={classes.createdDateContainer}>
          <CakeIcon />
          <Typography
            variant="subtitle1"
            component="p"
            className={classes.createdDate}
          >
            {`Created ${new Date(+community.createdAt).toDateString()}`}
          </Typography>
        </Box>
        <Box className={classes.actions}>
          <CommunityJoinLeaveButton
            communityName={community.name}
            className={classes.joinButton}
          />
          <Button
            fullWidth
            disableElevation
            variant="contained"
            color="primary"
            className={classes.createPostButton}
            onClick={goToCreatePost}
          >
            Create Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
export default CommunityDescription;
