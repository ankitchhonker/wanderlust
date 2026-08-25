import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { searchListings } from '../../api'
import toast from 'react-hot-toast'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/?search=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    await logout()
    toast.success('See you soon!')
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">✈</span>
          <span className="logo-text">Wanderlust</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            className="nav-search-input"
            type="text"
            placeholder="Search destinations, places…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="nav-search-btn" type="submit">
            <i className="fa fa-search" />
          </button>
        </form>

        <button className="nav-hamburger" onClick={() => setMenuOpen(m => !m)}>
          <i className={`fa ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Explore</Link>
          {user && (
            <Link to="/listings/new" className="nav-link" onClick={() => setMenuOpen(false)}>
              + Add Listing
            </Link>
          )}
          {!user ? (
            <>
              <Link to="/signup" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
            </>
          ) : (
            <div className="nav-user">
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                <i className="fa fa-user-circle" /> {user.username}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
