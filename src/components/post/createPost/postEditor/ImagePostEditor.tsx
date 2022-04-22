import { Box } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import { useUploadImage } from "../../../../graphql/hooks/useUploadImage";
import { UploadedImage } from "../../../types/types";
import ImagePostEditorDropZone from "./ImagePostEditorDropZone";
import ImagePostEditorPreview from "./ImagePostEditorPreview";

interface ImagePostEditorProps {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImagePostEditor = ({
  uploadedImages,
  setUploadedImages,
  setIsUploading,
}: ImagePostEditorProps) => {
  const [selectedImage, setSelectedImage] = useState("");
  const hasImageUploded = useMemo(() => uploadedImages.length !== 0, [
    uploadedImages,
  ]);

  const { onUpload, loading } = useUploadImage();
  const onDrop = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      for (let i = 0; i < files.length; i++) {
        const result = await onUpload(files[i]);
        if (result.data) {
          const uploadedImage = {
            path: result.data,
            caption: "",
            link: "",
          };
          setUploadedImages((prevState) => [...prevState, uploadedImage]);
          setSelectedImage(uploadedImage.path);
        }
      }
      setIsUploading(false);
    },
    [onUpload, setUploadedImages, setSelectedImage]
  );

  return (
    <Box>
      {hasImageUploded ? (
        <ImagePostEditorPreview
          {...{
            uploadedImages,
            selectedImage,
            setUploadedImages,
            setSelectedImage,
            onDrop,
          }}
        />
      ) : (
        <ImagePostEditorDropZone onDrop={onDrop} />
      )}
    </Box>
  );
};
export default ImagePostEditor;
