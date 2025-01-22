import { ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { Button, CssBaseline, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import Masthead from "./components/Masthead";
import Listing from './mash.pkgx.sh/Listing';
import Script from './mash.pkgx.sh/Script';
import Footer from "./components/Footer";
import Stars from './components/Stars';
import Hero from './mash.pkgx.sh/Hero';
import theme from './utils/theme';
import './assets/main.css';
import React from "react";
import Discord from './components/Discord';

function Body() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack minWidth='lg' p={isxs ? 1 : 4} spacing={isxs ? 8 : 16}>
      <MyMasthead />
      <Grid container spacing={2} sx={{"&&": {mt: 4}}}>
        <Grid size={{xs: 12, md: 9}}>
          <Router>
            <Routes>
              <Route path='/' element={<Listing />} />
              <Route path='/*' element={<Script />} />
            </Routes>
          </Router>
        </Grid>
        <Grid size={{xs: 12, md: 3}}>
          <Hero />
        </Grid>
      </Grid>
      <Footer />
    </Stack>
  )
}

function MyMasthead() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Masthead left={<Typography fontFamily='shader' color='secondary'>MASH</Typography>}>
    {!isxs && <>
      <Button href='https://docs.pkgx.sh' color='inherit'>docs</Button>
      <Button href='https://pkgx.dev/pkgs/' color='inherit'>pkgs</Button>
    </>}
    <Discord />
    <Stars href='https://github.com/pkgxdev/mash/' />
  </Masthead>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Body />
    </ThemeProvider>
  </React.StrictMode>,
);
