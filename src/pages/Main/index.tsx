import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ButtonGroup from "@mui/material/ButtonGroup";
// import rootStore from "./../../store";

const Main = () => {
  const navigate = useNavigate();

  // const { userStore } = rootStore;

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const isShowInstallBtn = localStorage.getItem("isInstallPwa") !== "true";

  // userStore
  //   .createUser("0000001233c3242c34c11", {
  //     name: "111",
  //     surname: "111",
  //     birthday: "111",
  //     city: "111",
  //     sex: "111",
  //     email: "111",
  //     activeChat: "",
  //   })
  //   .then(() => {
  //     console.log("success create user 222");
  //   });

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          localStorage.setItem("isInstallPwa", "true");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <Box
      sx={{
        // height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        justifyContent: "start",
        alignItems: "center",
        // py: {
        //   xs: 3,
        //   md: 5,
        // },
        p: 5,
        // padding: "8,
        // xs: {
        //   gap: 5,
        // },
      }}
    >
      <Avatar alt="avatar" src="/logo.svg" variant="square" sx={{ width: 100, height: 100 }} />

      <Box>
        <Typography variant="h2" color="white" fontWeight="bold" textAlign="center">
          Ayuta
        </Typography>
        <Typography variant="h4" color="white" textAlign="center">
          социальная сеть
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          "& > *": {
            m: 1,
            color: "white",
          },
        }}
      >
        <ButtonGroup orientation="vertical" aria-label="Vertical button group" variant="contained">
          <Button variant="contained" size="large" onClick={() => navigate("/login")} sx={{ background: "#b83e84", borderRadius: 2 }}>
            Зайти в приложение
          </Button>

          {isShowInstallBtn && (
            <Button variant="contained" size="large" onClick={handleInstallClick} sx={{ background: "#b83e84", borderRadius: 2 }}>
              Установить приложение
            </Button>
          )}

          <Button variant="contained" size="large" onClick={() => navigate("/faq")} sx={{ borderRadius: 2 }}>
            О приложении
          </Button>

          <Button variant="contained" size="large" onClick={() => navigate("/faq#privacyPolicy")} sx={{ borderRadius: 2 }}>
            Политика конфиденциальности
          </Button>

          <Button variant="contained" size="large" onClick={() => navigate("/faq#termsOfUse")} sx={{ borderRadius: 2 }}>
            Пользовательское соглашение
          </Button>

          <Button variant="contained" size="large" onClick={() => navigate("/feedback")} sx={{ borderRadius: 2 }}>
            Написать разработчикам
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default observer(Main);
