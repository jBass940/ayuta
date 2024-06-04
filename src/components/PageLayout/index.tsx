import * as React from "react";
import { observer } from "mobx-react-lite";
import rootStore from "../../store";

import BaseNavigation from "../BaseNavigation";
import { Box } from "@mui/material";

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
  hasBacking?: boolean;
};

const PageLayout = ({ header, children, hasBacking }: Props): React.ReactElement => {
  const {
    authStore: { isAuth },
  } = rootStore;

  return (
    <>
      {header}
      <Box
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          overflowY: "auto",
          position: "relative",
          flexGrow: 1,
          background: hasBacking ? "#ffffffba" : "transparent",
        }}
      >
        {children}
      </Box>
      {isAuth && <BaseNavigation />}
    </>
  );
};

export default observer(PageLayout);
