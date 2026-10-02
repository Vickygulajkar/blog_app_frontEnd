import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Admin from './pages/Admin'
// import Home from './pages/Home'

function App() {

  return (
    <>
      {/* <Home /> */}
      {/* <Login /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
