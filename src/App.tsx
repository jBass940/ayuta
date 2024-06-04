import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BaseLayout from "./components/BaseLayout";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/search";
import Faq from "./pages/faq";
import Chats from "./pages/chats";
import Guests from "./pages/guests";
import Shop from "./pages/shop";
import PostPage from "./pages/PostPage";
import AddPostPage from "./pages/AddPostPage";

import "./utils/firebaseConfig";

import rootStore from "./store";
import { observer } from "mobx-react-lite";

import "./App.css";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import { useEffect } from "react";
import { serverTimestamp } from "firebase/firestore";
import PublicRoute from "./features/PublicRoute";
import ProtectedRoute from "./features/ProtectedRoute";

import wheelImage from "./features/WheelOfFortune/wheel_svg.svg";
import { Box } from "@mui/material";
import FriendsPage from "./pages/FriendsPage";
import GiftsPage from "./pages/GiftsPage";
import Notification from "./components/Notification";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import Feedback from "./pages/Feedback";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8000a9",
    },
    secondary: {
      main: "#808080",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "black",
        },
      },
    },
  },
});

function App() {
  const { authStore, userStore } = rootStore;

  useEffect(() => {
    authStore.checkAuth();
  }, [authStore]);

  // useEffect(() => {
  //   document.addEventListener(
  //     "touchmove",
  //     function (event) {
  //       event.preventDefault();
  //     },
  //     { passive: false }
  //   );
  // }, [authStore]);

  useEffect(() => {
    if (!authStore.uid) return;

    userStore.updateUser({ isOnline: true, lastVisitDate: serverTimestamp() });

    document.addEventListener("visibilitychange", function () {
      userStore.updateUser({
        isOnline: document.visibilityState === "visible",
        lastVisitDate: serverTimestamp(),
      });
    });
  }, [authStore.uid, userStore]);

  if (authStore.uid === undefined)
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={wheelImage} alt="" style={{ width: "200px", height: "200px" }} className="rotate" />
      </Box>
    );

  const isAuthorized = !!authStore.uid;

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route element={<BaseLayout />}>
              {/* открыты всем */}
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/post/:userId/:postId" element={<PostPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/friends/all/:id" element={<FriendsPage />} />
              <Route path="/gifts/all/:id" element={<GiftsPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/feedback" element={<Feedback />} />

              {/* страницы дтолько для неавторизованных */}
              <Route path="/" element={<PublicRoute authStore={authStore} element={<Main />} />} />
              <Route path="/login" element={<PublicRoute authStore={authStore} element={<Login />} />} />
              <Route path="/register" element={<PublicRoute authStore={authStore} element={<Register />} />} />

              {/* страницы дтолько для авторизованныx */}
              <Route path="/profile/edit" element={<ProtectedRoute isAuthorized={isAuthorized} element={<EditProfile />} />} />
              <Route path="/add_post" element={<ProtectedRoute isAuthorized={isAuthorized} element={<AddPostPage />} />} />
              <Route path="/chats" element={<ProtectedRoute isAuthorized={isAuthorized} element={<Chats />} />} />
              <Route path="/chats/:chatId" element={<ProtectedRoute isAuthorized={isAuthorized} element={<ChatPage />} />} />
              <Route path="/guests" element={<ProtectedRoute isAuthorized={isAuthorized} element={<Guests />} />} />
              <Route path="/notifications" element={<ProtectedRoute isAuthorized={isAuthorized} element={<NotificationsPage />} />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>

      <Notification />
    </div>
  );
}

export default observer(App);
