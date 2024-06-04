import { useEffect } from 'react';
import { FC, ReactElement } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import logoWhite from '/logo.svg';
import logoDark from '/logo-dark.svg';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { Outlet, useNavigate, useLocation } from "react-router-dom";

import rootStore from './../../store';
import { observer } from 'mobx-react-lite';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const WallpaperCol = styled(Grid)(({ theme }) => ({
  height: '100vh',
  backgroundImage: "url('/bg.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const FormCol = styled(Grid)(({ theme }) => ({
  height: '100vh',
  width: '400px',
  display: 'flex',
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    height: '100vh',
    width: '100%',
    backgroundImage: "url('/bg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
}));

const Form = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // height: "100vh",
  width: '100%',
  margin: `${theme.spacing(10)} ${theme.spacing(5)}`,
  // paddingBottom: theme.spacing(5),
}));

const AuthLayout = () => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const pageTitle = pathname === '/login' ? 'Авторизация' : 'Регистрация';

  const logoSrc = downMd ? '/logo.svg' : '/logo-dark.svg';
  const titleColor = downMd ? 'white' : 'black';

  return (
    <Container disableGutters maxWidth={false}>
      <Grid
        container
        spacing={0}
        component="main"
        // sx={{ height: "100vh" }}
      >
        <WallpaperCol item md />
        <FormCol item>
          <Form>
            <Box
              sx={{
                width: '50px',
                height: '50px',
                backgroundImage: `url(${logoSrc})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0,
              }}
            />

            <Typography
              component="h1"
              variant="h5"
              marginTop={2}
              marginBottom={4}
              color={titleColor}
            >
              {pageTitle}
            </Typography>
            <Stack
              component="form"
              direction="column"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
              width="100%"
              // onSubmit={handleSubmit}
              paddingBottom={4}
            >
              <Outlet />
            </Stack>
          </Form>
        </FormCol>
      </Grid>
    </Container>
  );
};

export default observer(AuthLayout);
