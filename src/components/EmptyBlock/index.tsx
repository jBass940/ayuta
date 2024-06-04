import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  btnText?: string;
  link?: string;
};

const EmptyBlock = ({ title, btnText, link }: Props) => {
  const navigate = useNavigate();

  const isShowBtn = btnText && link;

  return (
    <Box
      sx={{
        width: "100%",
        // height: '100vh',
        height: "76vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.5)",
          p: 3,
          m: 2,
          borderRadius: 4,
        }}
      >
        <Typography fontSize={20}>{title}</Typography>
        {isShowBtn && (
          <Button variant="contained" onClick={() => navigate(link)} sx={{ marginTop: 2 }}>
            {btnText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EmptyBlock;
