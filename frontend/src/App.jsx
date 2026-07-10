import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import ListingShow from './pages/ListingShow'
import NewListing from './pages/NewListing'
import EditListing from './pages/EditListing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Home />} />
        <Route path="/listings/new" element={<NewListing />} />
        <Route path="/listings/:id" element={<ListingShow />} />
        <Route path="/listings/:id/edit" element={<EditListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </>
  )
}
