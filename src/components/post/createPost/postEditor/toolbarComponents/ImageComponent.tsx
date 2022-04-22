import {
  Box,
  createStyles,
  IconButton,
  LinearProgress,
  makeStyles,
  Popover,
  Theme,
  Tooltip,
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useCallback, useRef } from "react";
import { SERVER_URL } from "../../../../../const/envVariables";
import { useUploadImage } from "../../../../../graphql/hooks/useUploadImage";

interface ImageComponentProps {
  onChange: (
    src: string,
    height?: string,
    width?: string,
    alt?: string
  ) => void;
  onExpandEvent: () => void;
  expanded?: boolean;
  doCollapse: () => void;
}

interface ImageDropZoneProps {
  onChange: (
    src: string,
    height?: string,
    width?: string,
    alt?: string
  ) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      width: "370px",
      padding: "16px",
    },
    icon: {
      fontSize: "26px",
    },
  })
);

const ImageDropZone = ({ onChange }: ImageDropZoneProps) => {
  const { onUpload, loading } = useUploadImage();
  const onDrop = useCallback(
    async (files: File[]) => {
      for (let i = 0; i < files.length; i++) {
        const result = await onUpload(files[i]);
        if (result.data) {
          onChange(SERVER_URL + result.data, "auto", "100%");
        }
      }
    },
    [onUpload, onChange]
  );

  return (
    <Box onClick={(event) => event.stopPropagation()}>
      <DropzoneArea
        acceptedFiles={[
          "image/gif",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/svg",
        ]}
        filesLimit={1}
        showPreviewsInDropzone={false}
        // useChipsForPreview={true}
        onDrop={onDrop}
        getFileAddedMessage={undefined}
      />
      {loading ? <LinearProgress /> : null}
    </Box>
  );
};

const ImageComponent = ({
  onChange,
  onExpandEvent,
  expanded,
  doCollapse,
}: ImageComponentProps) => {
  const anchorRef = useRef();
  const classes = useStyles();

  return (
    <>
      <Tooltip title="Add an image">
        <IconButton
          size="small"
          onClick={onExpandEvent}
          aria-haspopup="true"
          aria-expanded={!!expanded}
          buttonRef={anchorRef}
        >
          <ImageIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Popover
        classes={{ paper: classes.popover }}
        open={!!expanded}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <ImageDropZone onChange={onChange} />
      </Popover>
    </>
  );
};
export default ImageComponent;
