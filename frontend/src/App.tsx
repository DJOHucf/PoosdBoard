import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import EmailVerificationWaitingPage from './pages/EmailVerificationWaitingPage.tsx';
import PlayerLandingPage from './pages/PlayerLandingPage.tsx';
import BingoBoardPage from './pages/BingoBoardPage.tsx';
import HomePage from './pages/HomePage.tsx';
import BingoHostPage from './pages/BingoHostPage.tsx';
import GamePINPage from './pages/GamePINPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<EmailVerificationWaitingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/play" element={<PlayerLandingPage />} />
        <Route path="/play/:gameId" element={<PlayerLandingPage />} />
        <Route path="/bingo" element={<BingoBoardPage />} />
        <Route path="/host" element={<BingoHostPage />} />
        <Route path="/host/:gameId" element={<BingoHostPage />} />
        <Route path="/game-pin" element={<GamePINPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;