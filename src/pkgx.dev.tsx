import { CssBaseline, Button, Stack, useTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import PackageShowcase from './pkgx.dev/PackageShowcase';
import PackageListing from './pkgx.dev/PackageListing';
import PrivacyPolicy from './pkgx.dev/PrivacyPolicy';
import { InstantSearch } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import TermsOfUse from './pkgx.dev/TermsOfUse';
import * as ReactDOM from 'react-dom/client';
import Masthead from './components/Masthead';
import HomeFeed from './pkgx.dev/HomeFeed';
import Footer from "./components/Footer";
import Search from './components/Search';
import Stars from './components/Stars';
import theme from './utils/theme';
import React, {  } from "react";
import './assets/main.css';
import Discord from './components/Discord';
import TeaProtocol from './pkgx.dev/TeaProtocol';


const searchClient = algoliasearch('UUTLHX01W7', '819a841ca219754c38918b8bcbbbfea7');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Stack direction="column" p={{xs: 1, md: 2}} maxWidth='lg' minHeight='100vh' mx='auto' spacing={4}>
          <MyMasthead />
          <Routes>
            <Route path='/' element={<HomeFeed />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
            <Route path='/terms-of-use' element={<TermsOfUse/>} />
            <Route path='/pkgs' element={<PackageShowcase />} />
            <Route path='/pkgs/*' element={<PackageListing/>} />
            <Route path='/tea' element={<TeaProtocol />} />
          </Routes>
          <Footer/>
        </Stack>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);

function MyMasthead() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));
  const { pathname } = useLocation();

  let gh = `https://github.com/pkgxdev/`
  if (pathname.startsWith('/pkgs')) gh += 'pantry/'

  const search = <InstantSearch searchClient={searchClient} indexName="pkgs">
    <Search />
  </InstantSearch>

  const stuff = <>
    <Button href='/pkgs/' color='inherit'>pkgs</Button>
    <Discord />
    <Stars href={gh} hideCountIfMobile={true} />
  </>

  return <Masthead>
    {pathname.startsWith('/pkgs') && isxs ? null : stuff}
    {pathname.startsWith('/pkgs') || !isxs ? search : undefined}
  </Masthead>
}
