import { observer } from "mobx-react-lite";
import * as React from "react";
import { Box, TextField, Button, Link as MUILink, Autocomplete, CircularProgress } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ru";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import store from "../../store";
import { createFilterOptions } from "@mui/material/Autocomplete";

import registerStore from "./store";
import cities, { CityOption } from "../../mock/cities";

const { authStore } = store;

const filterOptions = createFilterOptions({
  stringify: (option: CityOption) => option.label + option.id,
});

const Register = () => {
  const navigate = useNavigate();

  const { fields, isShowPassword, isShowPasswordConfirm } = registerStore;

  const locales = "ru" as const;

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(() => {
    return () => registerStore.clear();
  }, []);

  const onSubmitHandler = () => {
    authStore.register(registerStore.fields, (userId) => {
      navigate(`/profile/${userId}`);
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingX: {
          xs: "5rem",
          lg: "15rem",
        },
        height: "100vh",
        boxSizing: "border-box",
        overflowY: "auto",
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
        Регистрация
      </Typography>

      <TextField
        name="name"
        value={fields.name}
        onChange={(e) => registerStore.onChange(e)}
        label="Имя"
        margin="none"
        autoComplete="off"
        fullWidth
        autoFocus
        variant="filled"
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      />
      <TextField
        name="surname"
        value={fields.surname}
        onChange={(e) => registerStore.onChange(e)}
        label="Фамилия"
        margin="none"
        autoComplete="off"
        fullWidth
        variant="filled"
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>
        <DesktopDatePicker
          label="Дата рождения"
          inputFormat="MM/DD/YYYY"
          value={fields.birthday}
          onChange={(val) => registerStore.setDate(val as Dayjs)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="filled"
              // value={authStore.fields.birthday.value}
              // onChange={(e) => authStore.onChange(e)}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
          )}
        />
      </LocalizationProvider>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={cities}
        getOptionLabel={(city: any) => {
          return city ? `${city.label} (${city.region})` : "";
        }}
        noOptionsText="Нет подходящих городов"
        onChange={(e, v) => registerStore.setCity(v)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Город"
            variant="filled"
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
        )}
      />

      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="sex"
        value={registerStore.fields.sex}
        onChange={(e) => registerStore.onChange(e)}
      >
        <Grid container>
          <Grid item xs={6} textAlign="center" sx={{ color: downMd ? "white" : theme.palette.grey[700] }}>
            <FormControlLabel
              value="male"
              label="Мужчина"
              control={
                <Radio
                  sx={{
                    color: "white",
                  }}
                />
              }
              sx={{ color: "white" }}
            />
          </Grid>
          <Grid item xs={6} textAlign="center">
            <FormControlLabel value="female" label="Женщина" control={<Radio sx={{ color: "white" }} />} sx={{ color: "white" }} />
          </Grid>
        </Grid>
      </RadioGroup>

      <TextField
        name="email"
        label="Email"
        margin="none"
        autoComplete="off"
        fullWidth
        required
        variant={downMd ? "filled" : "outlined"}
        value={fields.email}
        onChange={(e) => registerStore.onChange(e)}
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      />

      <FormControl
        fullWidth
        variant="filled"
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      >
        <InputLabel htmlFor="password">Пароль</InputLabel>
        <FilledInput
          id="password"
          name="password"
          fullWidth
          type={isShowPassword ? "text" : "password"}
          value={fields.password}
          onChange={(e) => registerStore.onChange(e)}
          autoComplete="off"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => registerStore.togglePasswordVisible()}
                onMouseDown={() => registerStore.togglePasswordVisible()}
                edge="end"
              >
                {isShowPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl
        fullWidth
        variant="filled"
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
        }}
      >
        <InputLabel htmlFor="passwordConfirm">Подтверждение пароля</InputLabel>
        <FilledInput
          id="passwordConfirm"
          name="passwordConfirm"
          fullWidth
          type={isShowPasswordConfirm ? "text" : "password"}
          value={fields.passwordConfirm}
          onChange={(e) => registerStore.onChange(e)}
          autoComplete="off"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => registerStore.toggleConfirmPasswordVisible()}
                onMouseDown={() => registerStore.toggleConfirmPasswordVisible()}
                edge="end"
              >
                {isShowPasswordConfirm ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Box textAlign="justify">
        <Checkbox
          name="termOfUse"
          sx={{ padding: 0, color: "white" }}
          value={registerStore.fields.termOfUse}
          onChange={(e) => registerStore.onChangeCheckbox(e)}
        />
        <Typography variant="body2" component="span" color="text.secondary" display="inline-block" sx={{ px: 1, fontSize: 12, color: "white" }}>
          Я принимаю условия
        </Typography>
        <MUILink
          href="/termsOfUse.html"
          target="_blank"
          style={{
            fontSize: 12,
            paddingLeft: 6,
            paddingRight: 6,
            color: "white",
          }}
        >
          Пользовательского соглашения
        </MUILink>
        <Typography
          variant="body2"
          component="span"
          color="text.secondary"
          sx={{
            px: 1,
            fontSize: 12,
            color: "white",
          }}
        >
          и даю согласие на обработку своих персональных данных определённых
        </Typography>
        <MUILink
          href="/privacyPolicy.html"
          target="_blank"
          style={{
            fontSize: 12,
            paddingLeft: 6,
            paddingRight: 6,
            color: "white",
          }}
        >
          Политикой конфиденциальности
        </MUILink>
      </Box>

      <Button fullWidth variant="contained" size="large" sx={{ my: 2 }} onClick={onSubmitHandler} disabled={registerStore.isDisabled}>
        {authStore.isLoading && <CircularProgress size={26} sx={{ color: "white" }} />}
        {!authStore.isLoading && "Зарегистрироваться"}
      </Button>
      <MUILink
        component={Link}
        to="/login"
        variant="button"
        textAlign="center"
        display="block"
        marginTop={2}
        underline="none"
        sx={{
          color: "white",
          mb: 6,
        }}
      >
        Логин
      </MUILink>
    </Box>
  );
};

export default observer(Register);
