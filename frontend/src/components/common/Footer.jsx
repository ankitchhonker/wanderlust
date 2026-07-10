import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">✈</span>
          <span>Wanderlust</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Wanderlust. Discover extraordinary stays.</p>
        <div className="footer-links">
          <Link to="/">Explore</Link>
          <Link to="/listings/new">List your place</Link>
        </div>
      </div>
    </footer>
  )
}
