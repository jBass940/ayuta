import Lightbox, { SlideImage } from "yet-another-react-lightbox";
// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Box } from "@mui/material";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";

import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// If you want you can use SCSS instead of css
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/scss/lg-zoom.scss";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgComment from "lightgallery/plugins/comment";
import lgZoom from "lightgallery/plugins/zoom";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import lightGallery from "lightgallery";

export type CustomSlideImage = SlideImage & {
  id: number;
  title?: ReactNode;
  description?: ReactNode;
};

type Props = {
  isOpen: boolean;
  images: CustomSlideImage[];
  onClose: () => void;
  onOpenModal: () => void;
};

const LightGalleryComponent = ({
  isOpen,
  images,
  onClose,
  onOpenModal,
}: Props) => {
  console.log("images ", images);

  const lightGalleryRef = useRef(null);

  const slides = images.map((image, index) => ({
    ...image,
    title: <Box sx={{ display: "flex", justifyContent: "end" }}>111</Box>,
    description: (
      <b style={{ fontSize: "30px" }}>
        Vicko Mozara\n\nVeliki zali, Dubravica, Croatia {index}
      </b>
    ),
  }));

  const onInit = () => {
    console.log("lightGallery has been initialized");
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    // console.log("lightGalleryRef.current ", lightGalleryRef.current);

    // // const lightGalleryInstance = document.getElementById("lightgallery");
    // const trigger = document.getElementById("trigger");
    // const lTrigger = document.getElementById("lTrigger");

    // // if (!lightGalleryInstance) return;
    // if (!trigger) return;
    // if (!lTrigger) return;

    // // lightGallery(lightGalleryInstance);

    // trigger.addEventListener("click", () => {
    //   lTrigger.click();
    // });
  };
  return (
    <div>
      {/* <button id="trigger">TRIGGER</button> */}
      <LightGallery
        onInit={onInit}
        // commentBox={true}
        // speed={500}
        // plugins={[lgThumbnail, lgZoom]}
        // plugins={[lgZoom, lgComment]}
        // commentsMarkup="dfvddf"
        closable={false}
        mode="lg-fade"
      >
        {slides.map((slide, index) => {
          const description = slide.description;

          return (
            <a
              key={index}
              id={index === 0 ? "lTrigger" : ""}
              href={slide.src}
              data-src={slide.src}
              data-sub-html={description.props.children}
            >
              <img alt="" src={slide.src} className="img-responsive" />
            </a>
          );
        })}
      </LightGallery>
    </div>
  );

  // return (
  //   <Box sx={{ position: "relative" }}>
  //     <Lightbox
  //       open={isOpen}
  //       close={() => onClose()}
  //       plugins={[Captions]}
  //       // slides={images}
  //       slides={slides}
  //       on={{
  //         view: (index) => {
  //           console.log(index);
  //         },
  //       }}
  //     />
  //     {isOpen && (
  //       <Box
  //         className="d-flex"
  //         sx={{ position: "absolute", bottom: 30, right: 15, zIndex: 1000 }}
  //       >
  //         {/* <Box sx={{ color: "white" }}>1</Box> */}
  //         {/* <Box sx={{ color: "white" }}>2</Box> */}
  //         {/* <Button>Установить как аватар</Button>
  //         <Button>Установить как аватар</Button> */}
  //       </Box>
  //     )}
  //   </Box>
  // );
};

export default observer(LightGalleryComponent);
