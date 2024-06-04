import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

type Props = {
  title?: string;
  children?: JSX.Element;
};

const BaseAppBar = ({ title, children }: Props) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => navigate(-1)}
        >
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <ArrowBackIosIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              paddingLeft: 1,
            }}
          >
            {title}
          </Typography>
        </Box>
        <>{children}</>
      </Toolbar>
    </AppBar>
  );
};

export default observer(BaseAppBar);
