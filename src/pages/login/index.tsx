import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Button,
  TextField,
  Link as MUILink,
  // useMediaQuery,
  FormControl,
  InputLabel,
  FilledInput,
  IconButton,
  // OutlinedInput,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// import { useTheme } from "@mui/material/styles";
import loginStore from "./store";
import rootStore from "../../store";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  // const theme = useTheme();
  // const downMd = useMediaQuery(theme.breakpoints.down("md"));

  const { authStore } = rootStore;

  // const linkColor = downMd ? "white" : theme.palette.primary.main;

  const login = async () => {
    const { email, password } = loginStore.fields;

    authStore.login(email.value, password.value, (uid) => {
      navigate(`/profile/${uid}`);
    });
  };

  return (
    <Box
      sx={{
        paddingX: {
          xs: "5rem",
          // sm: "5rem",
          // md: "5rem",
          lg: "15rem",
          // xl: "15rem",
        },
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        marginTop={6}
        marginBottom={4}
        color="white"
        sx={{
          textAlign: "center",
        }}
      >
        Авторизация
      </Typography>

      <TextField
        name="email"
        margin="normal"
        required
        fullWidth
        label="Email"
        variant={"filled"}
        autoComplete="off"
        autoFocus
        value={loginStore.fields.email.value}
        onChange={(e) => loginStore.onChange(e)}
        sx={{ backgroundColor: "white", borderRadius: "4px" }}
      />

      <FormControl
        fullWidth
        variant={"filled"}
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      >
        <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
        <FilledInput
          name="password"
          fullWidth
          type={loginStore.isShowPassword ? "text" : "password"}
          value={loginStore.fields.password.value}
          onChange={(e) => loginStore.onChange(e)}
          autoComplete="off"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => loginStore.togglePasswordVisible()}
                onMouseDown={() => loginStore.togglePasswordVisible()}
                edge="end"
              >
                {loginStore.isShowPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Button fullWidth variant="contained" size="large" sx={{ my: 2 }} onClick={login}>
        {authStore.isLoading && <CircularProgress size={26} sx={{ color: "white" }} />}
        {!authStore.isLoading && "Войти"}
      </Button>
      <MUILink component={Link} to="/register" variant="button" textAlign="center" display="block" marginTop={2} underline="none" color="white">
        Регистрация
      </MUILink>
    </Box>
  );
};

export default observer(Login);
