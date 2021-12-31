import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  RegularCommunityFragment,
  UserRoleQuery,
} from "../../generated/graphql";
import { SnackbarAlert } from "../errorHandling/SnackbarAlert";
import CommunityJoinLeaveButton from "./CommunityJoinLeaveButton";

interface CommunityBannerProps {
  community: RegularCommunityFragment;
  userRole: UserRoleQuery["userRole"];
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bannerImage: {
      background:
        'url("https://styles.redditmedia.com/t5_12p4l2/styles/bannerBackgroundImage_w5jk6fw1kg181.png?width=4000&s=681933d1131c611f797fa5827040908dadb60ffa") center center / cover no-repeat',
      height: 228,
    },
    header: {
      backgroundColor: theme.palette.background.paper,
      height: "100px",
    },
    pinndedHeader: {
      position: "sticky",
      height: "58px",
      top: "56px",
      zIndex: 80,
      backgroundColor: theme.palette.background.paper,
      borderBottom: "#edeff1",
    },
    headerContent: {
      margin: "0 auto",
      maxWidth: "984px",
    },
    communityIcon: {
      borderRadius: "100%",
      border: "4px solid #fff",
      height: "72px",
      width: "72px",
    },
    communityName: {
      fontWeight: 700,
    },
    communityPath: {
      color: "#7c7c7c",
    },
    communityNameContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
      marginTop: "1.5em",
      paddingLeft: "1em",
    },
  })
);

const CommunityBanner = ({ community, userRole }: CommunityBannerProps) => {
  console.log(userRole);
  const classes = useStyles();
  const { ref, inView } = useInView({ threshold: 0.5 });

  return (
    <>
      <Box className={classes.bannerImage} />
      <div ref={ref} className={classes.header}>
        <Box className={classes.headerContent}>
          <Box display="flex" position="relative" top="-1em">
            <img
              src="https://styles.redditmedia.com/t5_12p4l2/styles/communityIcon_buxnyc6v9pq61.png?width=256&s=88c56db4f5865262d369b99d559922921b8d2991"
              className={classes.communityIcon}
            />
            <Box className={classes.communityNameContainer}>
              <Box>
                <Typography variant="h5" className={classes.communityName}>
                  {community.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  className={classes.communityPath}
                >{`r/${community.name}`}</Typography>
              </Box>
              <CommunityJoinLeaveButton
                {...{ userRole, communityId:community.id, communityName:community.name }}
              />
            </Box>
          </Box>
        </Box>
      </div>
      {!inView ? <div className={classes.pinndedHeader}></div> : null}
    </>
  );
};
export default CommunityBanner;
