import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Overview from "./components/overview/Overview"
import Ledger from "./components/ledger/Ledger"
import Purchases from "./components/purchases/Purchases"
import LoginPage from "./components/auth/LoginPage"
import SignupPage from "./components/auth/SignupPage"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useState } from "react"

const AUTH_STORAGE_KEY = "dabba-fund-authenticated"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === "true",
  )
  const location = useLocation()
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup"

  const handleLogin = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, "true")
    setIsAuthenticated(true)
  }

  const dashboard = isAuthenticated ? <Overview /> : <Navigate to="/login" replace />
  const protectedLedger = isAuthenticated ? <Ledger /> : <Navigate to="/login" replace />
  const protectedPurchases = isAuthenticated ? <Purchases /> : <Navigate to="/login" replace />
  const loginPage = isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
  const signupPage = isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />

  return (
    <>
      {!isAuthRoute && isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={dashboard} />
        <Route path="/overview" element={dashboard} />
        <Route path="/ledger" element={protectedLedger} />
        <Route path="/purchases" element={protectedPurchases} />
        <Route path="/login" element={loginPage} />
        <Route path="/signup" element={signupPage} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
      {!isAuthRoute && isAuthenticated && <Footer />}
    </>
  )
}

export default App
