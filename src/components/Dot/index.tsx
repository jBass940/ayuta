import * as React from "react";
import { Box } from "@mui/material";

const Dot = ({ isOnline }: { isOnline: boolean }) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        width: "12px",
        height: "12px",
        backgroundColor: isOnline ? "green" : "gray",
        borderRadius: "50%",
      }}
    />
  );
};

export default Dot;
