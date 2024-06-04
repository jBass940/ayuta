import { Box } from "@mui/material";

import { observer } from "mobx-react-lite";
import BaseAppBar from "../../components/BaseAppBar";

const Feedback = () => {
  return (
    <>
      <BaseAppBar title="Обратная связь" />
      <Box
        sx={{
          p: 4,
          pb: 8,
          // background: "#ffffff2b",
          background: "#ffffffba",
          height: "100vh",
        }}
      >
        Для связи с нами вы можете написать письмо на электронную почту <a href="mailto:ayuta1255@gmail.com">ayuta1255@gmail.com</a>
      </Box>
    </>
  );
};

export default observer(Feedback);
