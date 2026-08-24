import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Overview from "./components/section/overview/Overview"
import { Routes, Route } from "react-router"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/overview" element={<Overview />}/>
      </Routes>
      <Footer />
    </>
  )
}

export default App