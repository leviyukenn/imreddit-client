import {
  Button,
  ButtonProps,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { useJoinCommunity } from "../../graphql/hooks/useJoinCommunity";
import { useLeaveCommunity } from "../../graphql/hooks/useLeaveCommunityMutation";
import { useUserCommunityRole } from "../../graphql/hooks/useUserCommunityRole";
import { useIsAuth } from "../../utils/hooks/useIsAuth";
import { createComposedClasses } from "../../utils/utils";

interface CommunityJoinLeaveButtonProps extends ButtonProps {
  communityName: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinButton: {
      borderRadius: "9999px",
      textTransform: "none",
      fontWeight: 700,
      lineHeight: "1.5em",
    },
  })
);

const CommunityJoinLeaveButton = ({
  communityName,
  className,
  ...props
}: CommunityJoinLeaveButtonProps) => {
  const classes = useStyles();
  const [buttonLabel, setButtonLabel] = useState("Joined");
  const { me, checkIsAuth } = useIsAuth();
  const { joinCommunity, loading: joinCommunityLoading } = useJoinCommunity();
  const { userRole, refetch } = useUserCommunityRole(communityName);
  const {
    leaveCommunity,
    loading: leaveCommunityLoading,
  } = useLeaveCommunity();

  const onJoin = useCallback(async () => {
    if (!checkIsAuth()) return;
    const success = await joinCommunity(communityName);
    if (success) refetch({ userName: me?.username!, communityName });
  }, [joinCommunity, me, checkIsAuth, communityName]);

  const onLeave = useCallback(async () => {
    if (!checkIsAuth()) return;
    await leaveCommunity(communityName);
  }, [leaveCommunity, me, checkIsAuth, communityName]);

  return (
    <>
      {userRole?.isMember ? (
        <Button
          variant="outlined"
          color="primary"
          className={
            className
              ? createComposedClasses(classes.joinButton, className)
              : classes.joinButton
          }
          onMouseOver={() => {
            setButtonLabel("Leave");
          }}
          onMouseOut={() => {
            setButtonLabel("Joined");
          }}
          onClick={onLeave}
          disabled={leaveCommunityLoading}
          {...props}
        >
          {buttonLabel}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className={
            className
              ? createComposedClasses(classes.joinButton, className)
              : classes.joinButton
          }
          onClick={onJoin}
          disabled={joinCommunityLoading}
          fullWidth={true}
          {...props}
        >
          Join
        </Button>
      )}
    </>
  );
};
export default CommunityJoinLeaveButton;
