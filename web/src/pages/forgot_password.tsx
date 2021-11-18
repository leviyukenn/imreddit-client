import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import Container from "../components/Container";
import ForgotPassword from "../components/user/ForgotPasswordForm";
import { SERVER_URL } from "../const/const";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sideImage: {
      backgroundImage: `url(${
        SERVER_URL + "/resources/backgroundImages/createCommunityImg.jpeg"
      })`,
      minHeight: "calc(100vh - 56px)",
      width: "140px",
      backgroundPosition: "60%",
    },
  })
);
const forgotPassword = () => {
  const classes = useStyles();
  return (
    <Container backgroundMode="light">
      <Box display="flex">
        <Box className={classes.sideImage} />
        <ForgotPassword />
      </Box>
    </Container>
  );
};
export default forgotPassword;