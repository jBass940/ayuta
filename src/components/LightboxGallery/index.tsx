import Lightbox, { SlideImage } from "yet-another-react-lightbox";
// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Box } from "@mui/material";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { ReactNode } from "react";

export type CustomSlideImage = SlideImage & {
  id: number;
  title?: ReactNode;
  description?: ReactNode;
  postKey: string;
};

type Props = {
  isOpen: boolean;
  images: CustomSlideImage[];
  onClose: () => void;
  onOpenModal: () => void;
};

const LightboxGallery = ({ isOpen, images, onClose, onOpenModal }: Props) => {
  console.log("images ", images);

  const slides = images.map((image) => ({
    ...image,
    title: <Box sx={{ display: "flex", justifyContent: "end" }}>111</Box>,
    description: (
      <b style={{ fontSize: "30px" }}>
        Vicko Mozara\n\nVeliki zali, Dubravica, Croatia
      </b>
    ),
  }));

  return (
    <Box sx={{ position: "relative" }}>
      <Lightbox
        open={isOpen}
        close={() => onClose()}
        plugins={[Captions]}
        // slides={images}
        slides={slides}
        on={{
          view: (index) => {
            console.log(index);
          },
        }}
      />
      {isOpen && (
        <Box
          className="d-flex"
          sx={{ position: "absolute", bottom: 30, right: 15, zIndex: 1000 }}
        >
          {/* <Box sx={{ color: "white" }}>1</Box> */}
          {/* <Box sx={{ color: "white" }}>2</Box> */}
          {/* <Button>Установить как аватар</Button>
          <Button>Установить как аватар</Button> */}
        </Box>
      )}
    </Box>
  );
};

export default LightboxGallery;
