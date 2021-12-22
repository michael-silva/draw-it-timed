import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import './App.css';
import { Terms } from './pages/Terms'
import { Main } from './pages/Main'
import { useState } from 'react';
import { Topbar } from './components/Topbar';
import { Auth } from './pages/Auth';
import { Container } from '@mui/material';
import { Box } from '@mui/system';

const isDevelop = process.env.NODE_ENV === 'development'
const darkTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: 'dark',
  },
}));
const lightTheme = responsiveFontSizes(createTheme());



function App() {
  const [darkMode, setDarkMode] = useState(false)
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
    <CssBaseline />
    <BrowserRouter basename={isDevelop ? '/' : process.env.PUBLIC_URL}>
      <Topbar darkMode={darkMode} onChangeTheme={() => setDarkMode(mode => !mode)} />
      <Container>
      <Box sx={{ mt: 10 }}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </Box>
    </Container>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
