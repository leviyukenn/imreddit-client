import { Box, Link } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../../generated/graphql";
import CommunitySearchBar from "./CommunitySearchBar";
import CommunitySelection from "./CommunitySelection";
import UserStatusBar from "./UserStatusBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      position: "sticky",
      top: 0,
      height: "56px",
      borderBottom: "1px solid #edeff1",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      borderRadius: "9999px",
    },
    toolBar: {
      minHeight: "56px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    leftContainer: {
      flex: 1,
      display: "flex",
      alignItems: "center",
    },
    rightContainer: {
      // flex: 1,
      maxWidth: 210,
      display: "flex",
      alignItems: "center",
    },
    iconContainer: {
      display: "flex",
      height: 56,
      alignItems: "center",
    },
    icon: {
      height: 48,
      marginRight: "0.5rem",
    },
    name: {
      fontWeight: 700,
    },
  })
);

export default function NavBar() {
  const classes = useStyles();
  const { data: meResponse } = useMeQuery();

  return (
    <AppBar position="static" elevation={0} className={classes.root}>
      <Toolbar className={classes.toolBar}>
        <Box className={classes.leftContainer}>
          <NextLink href="/" passHref>
            <Link underline="none">
              <Box className={classes.iconContainer}>
                <img src="/logo.png" className={classes.icon} />
                <Typography
                  variant="h6"
                  color="textPrimary"
                  className={classes.name}
                >
                  Imreddit
                </Typography>
              </Box>
            </Link>
          </NextLink>
          {meResponse?.me ? (
            <Box marginLeft="2em">
              <CommunitySelection me={meResponse.me} />
            </Box>
          ) : null}
          <Box marginLeft="1em" flex={1}>
            <CommunitySearchBar />
          </Box>
        </Box>
        <Box className={classes.rightContainer}>
          <UserStatusBar />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
