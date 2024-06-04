import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const AddPost = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", alignItems: "center", pt: 0, pb: 2, pl: 0, mx: { xs: 1, sm: 0 } }}>
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#ffffffba",
          border: "3px solid #8000a9",
          borderRadius: "15px",
          padding: "15px",
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        Добавить свои интересы
        <br />
        игры, фильмы музыку
      </Box>
      <AddCircleIcon sx={{ fontSize: "60px", color: "white", cursor: "pointer", ml: 2 }} onClick={() => navigate("/add_post")} />
    </Box>
  );
};

export default AddPost;
