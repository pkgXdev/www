import { ThemeProvider, useTheme } from '@mui/material/styles';
import { Box, Button, CssBaseline, IconButton, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { RunAnything, RunAnywhere, Dev, Trusted, Quote } from "./pkgx.sh/Landing";
import React, { useEffect, useState } from "react";
import github from "./assets/wordmarks/github.svg";
import * as ReactDOM from 'react-dom/client';
import theme from './utils/theme';
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import Hero from "./pkgx.sh/Hero";
import './main.css';

function Body() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack maxWidth='md' p={isxs ? 1 : 4} spacing={isxs ? 8 : 16} mx='auto'>
      <MyMasthead />
      <Hero />
      <RunAnything />
      <Quote />
      <RunAnywhere />
      <Dev />
      <Trusted />
      <Footer />
    </Stack>
  )
}

function MyMasthead() {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/stars.json');
      const data = await response.json();
      setStars(data);
    };

    fetchData();
  }, []);

  return <Masthead>
    <Button href='https://docs.pkgx.sh' color='inherit'>docs</Button>
    <Button href='https://pkgx.dev/pkgs/' color='inherit'>pkgs</Button>
    <Button href='https://web.libera.chat/?channel=#pkgx' color='inherit'>irc</Button>
      <Stack spacing={0} direction='row' alignItems='center'>
        <IconButton href='https://github.com/pkgxdev/pkgx'>
          <Box component='img' src={github}/>
        </IconButton>
        <Tooltip title='Total Org. Stars' arrow placement='right' enterTouchDelay={0}>
          <Typography color='text.secondary' width={44} fontSize={13} overflow='clip' component='span'>
            {stars}
          </Typography>
        </Tooltip>
      </Stack>
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
