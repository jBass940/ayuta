import { Box } from "@mui/material";

type Props = {
  offset?: number;
  size?: number;
  enable?: boolean;
  onClick?: () => void;
};

function Crown({ offset = 15, size = 30, enable = false, onClick }: Props) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: offset,
        right: offset,
        zIndex: 1000,
        backgroundImage: `url(${
          enable ? "/crown-enable.svg" : "/crown-disable.svg"
        })`,
        width: size,
        height: size,
        cursor: "pointer",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: enable ? 1 : 0.5,
      }}
      onClick={onClick}
    />
  );
}

export default Crown;
