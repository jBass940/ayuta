import { useEffect, useRef } from "react";
import { Button, Box, styled } from "@mui/material";
import { serverTimestamp, FieldValue } from "firebase/firestore";

// import wheelImage from "./wheel_250.png";
import wheelImage from "./wheel_svg.svg";
import arrowGreen from "./arrow_green.svg";
import { observer } from "mobx-react-lite";
import { Typography } from "@mui/material";

import localStore from "./store";
import rootStore from "../../store";
import gsap from "gsap";
import { degreeToGiftCategory } from "./const";
import BaseModal from "../../components/BaseModal";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";

import Api from "./../../api";

import utc from "dayjs/plugin/utc";
import { Gift } from "../../types";
// import { serverTimestamp } from "firebase/firestore";
dayjs.extend(utc);

const Wrapper = styled(Box)(() => ({
  backgroundColor: "#ffffffba",
  // borderRadius: '15px',
  padding: "15px",
  position: "relative",
}));

const Content = styled(Box)(() => ({
  // height: 250,
  margin: "15px 0",
  // opacity: "0.5",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  justifyContent: "center",
}));

const Footer = styled(Box)(() => ({
  fontSize: 14,
  color: "black",
}));

const WheelOfFortune = ({ isShow }: { isShow: boolean }) => {
  const { authStore, subscribtionsStore, modalStore } = rootStore;
  const { isShowCloseAdModalBtn, runShowCloseBtn, generateDegrees, addGift, gift, createTimer, seconds, deleteTimer, checkWheelStatus } = localStore;

  const wheelRef = useRef<HTMLImageElement>(null);

  const activeSubscribtion = subscribtionsStore.getSubscriptionByType("WHEEL");
  const opacity = activeSubscribtion?.attemptsCount ? 1 : 0.5;
  const btnLabel = activeSubscribtion ? "КРУТИТЬ" : "КУПИТЬ";
  const noAttempts = activeSubscribtion?.attemptsCount === 0;
  const isAdViewed = activeSubscribtion?.isAdViewed;
  const isShowCoutdown = noAttempts && isAdViewed;

  useEffect(() => {
    console.debug("checkWheelStatus");

    checkWheelStatus(activeSubscribtion, () => {
      subscribtionsStore
        .update({
          id: String(activeSubscribtion?.docId),
          payload: {
            attemptsCount: 2,
            isAdViewed: false,
            periodStart: 0,
          },
        })
        .then(() => modalStore.close());
    });

    return () => deleteTimer();
  }, [activeSubscribtion, checkWheelStatus, createTimer, deleteTimer, modalStore, subscribtionsStore]);

  if (!isShow) return null;

  const clock = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return dayjs().hour(hours).minute(minutes).second(remainingSeconds).format("HH:mm:ss");
  };

  const actionBtnHandler = () => {
    // // сначала чекаем есть активная подписка
    if (!activeSubscribtion) {
      modalStore.open({ type: "BUY_WHEEL_SUBSCRIPTION" });
      return;
    }

    // // если активная подписка есть чекаем нужно ли показывать рекламу
    const runAd = activeSubscribtion?.attemptsCount === 1 && !activeSubscribtion.isAdViewed;
    if (runAd) {
      modalStore.open({ type: "SHOW_AD" });
      runShowCloseBtn();
      return;
    }

    // либо вертим колесо
    const degrees = generateDegrees();

    gsap.to(wheelRef.current, {
      rotation: generateDegrees(),
      duration: 3,
      onComplete: () => {
        gsap.to(wheelRef.current, { rotate: 0, duration: 0 });

        const sector = Math.floor((degrees % 360) / 18);

        if (sector === 3 || sector === 6 || sector === 9 || sector === 12 || sector === 15 || sector === 18) {
          // giftsStore.clearGift();
          alert("Вторая очередь");
          return;
        }

        const giftCategory = degreeToGiftCategory[sector];

        Api.gift.getRandomGiftByCategory(giftCategory).then((gift: Gift) => {
          // обновляем подписку новыми данными
          subscribtionsStore.update({
            id: String(activeSubscribtion?.docId),
            payload: {
              attemptsCount: Number(activeSubscribtion?.attemptsCount) - 1,
              ...(activeSubscribtion?.attemptsCount === 2 && { periodStart: serverTimestamp() }),
            },
          });

          // добавление подарка юзеру
          addGift(String(authStore.uid), {
            ...gift,
            type: "WON",
          });

          // показываем модалку с выигранным подарком
          modalStore.open({ type: "GIFT_WON" });
        });
      },
    });
  };

  const buyWheelHandler = (monthCount: number) => {
    subscribtionsStore
      .create({
        type: "WHEEL",
        month: monthCount,
        attemptsCount: 2,
        isAdViewed: false,
        periodStart: 0,
      })
      .then(() => modalStore.close());
  };

  return (
    <Wrapper
      sx={{
        borderRadius: {
          xs: 0,
          sm: 2,
        },
        sm: {
          magrinBottom: 2,
        },
      }}
    >
      <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>Колесо фортуны</Typography>

      <Content>
        <img
          ref={wheelRef}
          src={wheelImage}
          alt="alt"
          style={{
            // width: downMd ? 360 : 250,
            // height: downMd ? 360 : 250,
            width: "100%",
            opacity: opacity,
          }}
        />

        <Box
          sx={{
            display: isShowCoutdown ? "flex" : "none",
            position: "absolute",
            top: 0,
            height: "100%",
            zIndex: 100,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 38,
            fontWeight: "bold",
          }}
        >
          {clock()}
        </Box>
      </Content>

      <img
        src={arrowGreen}
        alt="alt"
        style={{
          width: 21,
          position: "absolute",
          top: 52,
          right: "calc(50% - 10px)",
          transform: "rotate(-90deg)",
          opacity: opacity,
        }}
      />

      <Footer>
        <Button fullWidth variant="contained" size="large" onClick={actionBtnHandler} disabled={noAttempts}>
          {btnLabel}
        </Button>
      </Footer>

      <BaseModal title="Подписка" isOpen={modalStore.visible("BUY_WHEEL_SUBSCRIPTION")} closeModal={() => modalStore.close()}>
        <Box textAlign="center">
          <Box>
            <p>Купить подписку на колесо-фортуны:</p>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Button variant="contained" style={{ marginBottom: "15px" }} onClick={() => buyWheelHandler(1)}>
                1 месяц
              </Button>
              <Button variant="contained" style={{ marginBottom: "15px" }} onClick={() => buyWheelHandler(3)}>
                3 месяца
              </Button>
              <Button variant="contained" style={{ marginBottom: "15px" }} onClick={() => buyWheelHandler(12)}>
                12 месяцев
              </Button>
            </Box>
          </Box>
          <Button variant="contained" onClick={() => modalStore.close()}>
            Отмена
          </Button>
        </Box>
      </BaseModal>

      <BaseModal title="Вы выиграли подарок!" isOpen={modalStore.visible("GIFT_WON")} closeModal={() => modalStore.close()}>
        <Box textAlign="center">
          <div
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "8px",
              display: "flex",
              position: "relative",
              backgroundSize: "75%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url(${gift?.image})`,
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              modalStore.close();
              // giftsStore.clearGift();
            }}
          >
            OK
          </Button>
        </Box>
      </BaseModal>

      <Box
        sx={{
          position: "fixed",
          backgroundColor: "black",
          top: 0,
          left: 0,
          zIndex: 9990,
          width: "100%",
          height: "100vh",
          display: modalStore.visible("SHOW_AD") ? "flex" : "none",
        }}
      >
        <Box color="white" sx={{ m: "auto" }}>
          ТУТ РАЗМЕЩАЕТСЯ РЕКЛАМА ЯНДЕКСА :))
        </Box>

        <CancelIcon
          visibility={isShowCloseAdModalBtn ? "visible" : "hidden"}
          onClick={async () => {
            await subscribtionsStore.update({ id: String(activeSubscribtion?.docId), payload: { isAdViewed: true } });
            modalStore.close();
          }}
          sx={{
            position: "absolute",
            top: 35,
            right: 35,
            zIndex: 9999,
            fontSize: 68,
            color: "white",
            cursor: "pointer",
          }}
        />
      </Box>
    </Wrapper>
  );
};

export default observer(WheelOfFortune);
