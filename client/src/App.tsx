import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Overview from "./components/overview/Overview"
import Ledger from "./components/ledger/Ledger"
import Purchases from "./components/purchases/Purchases"
import Home from "./components/home/Home"
import LoginPage from "./components/auth/LoginPage"
import SignupPage from "./components/auth/SignupPage"
import { defaultContributors } from "./data/contributors"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useState } from "react"

const AUTH_STORAGE_KEY = "dabba-fund-authenticated"
const AUTH_CONTRIBUTOR_ID_KEY = "dabba-fund-contributor-id"

function App() {
  const getSavedContributorId = () => localStorage.getItem(AUTH_CONTRIBUTOR_ID_KEY)
  const isSavedContributorValid = (contributorId: string | null) =>
    defaultContributors.some((contributor) => contributor.id === contributorId)

  const [currentContributorId, setCurrentContributorId] = useState(() => {
    const savedContributorId = getSavedContributorId()
    return isSavedContributorValid(savedContributorId) ? savedContributorId : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === "true" && currentContributorId !== null,
  )
  const location = useLocation()
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup"

  const handleLogin = (contributorId: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, "true")
    localStorage.setItem(AUTH_CONTRIBUTOR_ID_KEY, contributorId)
    setCurrentContributorId(contributorId)
    setIsAuthenticated(true)
  }

  const homePage = isAuthenticated ? <Overview currentContributorId={currentContributorId} /> : <Home />
  const dashboard = isAuthenticated ? <Overview currentContributorId={currentContributorId} /> : <Navigate to="/" replace />
  const protectedLedger = isAuthenticated ? <Ledger /> : <Navigate to="/login" replace />
  const protectedPurchases = isAuthenticated ? <Purchases /> : <Navigate to="/login" replace />
  const loginPage = isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
  const signupPage = isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />

  return (
    <>
      {!isAuthRoute && isAuthenticated && <Header currentContributorId={currentContributorId} />}
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
