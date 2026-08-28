import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Overview from "./components/overview/Overview"
import Ledger from "./components/ledger/Ledger"
import Purchases from "./components/purchases/Purchases"
import Home from "./components/home/Home"
import LoginPage from "./components/auth/LoginPage"
import SignupPage from "./components/auth/SignupPage"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useAuth } from "./context/useAuth"

function App() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup"

  const homePage = isAuthenticated ? <Overview /> : <Home />
  const dashboard = isAuthenticated ? <Overview /> : <Navigate to="/" replace />
  const protectedLedger = isAuthenticated ? <Ledger /> : <Navigate to="/login" replace />
  const protectedPurchases = isAuthenticated ? <Purchases /> : <Navigate to="/login" replace />
  const loginPage = isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
  const signupPage = isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />

  return (
    <>
      {!isAuthRoute && isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={homePage} />
        <Route path="/overview" element={dashboard} />
        <Route path="/ledger" element={protectedLedger} />
        <Route path="/purchases" element={protectedPurchases} />
        <Route path="/login" element={loginPage} />
        <Route path="/signup" element={signupPage} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthRoute && isAuthenticated && <Footer />}
    </>
  )
}

export default App
