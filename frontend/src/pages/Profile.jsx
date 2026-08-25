import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyBookings } from '../api'
import toast from 'react-hot-toast'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    fetchMyBookings()
      .then(res => setBookings(res.data.bookings))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container empty-state">
          <h2>Please <Link to="/login">login</Link> to view your profile.</h2>
        </div>
      </div>
    )
  }

  return (
    <main className="page-wrapper">
      <div className="container profile-container">
        
        {/* Profile Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <hr className="divider" />
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{bookings.length}</span>
                <span className="stat-label">Trips</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="profile-content">
          <h2 className="content-title">My Trips</h2>
          
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <i className="fa fa-suitcase-rolling"></i>
              <p>No trips booked... yet!</p>
              <Link to="/" className="btn btn-outline" style={{marginTop:'15px'}}>Start exploring</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-img-wrap">
                    <img 
                      src={booking.listing?.image?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'} 
                      alt={booking.listing?.title} 
                      className="booking-img"
                    />
                  </div>
                  <div className="booking-details">
                    <div className="booking-header">
                      <h3>{booking.listing?.title || 'Listing deleted'}</h3>
                      <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                    </div>
                    <p className="booking-location">
                      <i className="fa fa-location-dot" /> {booking.listing?.location}, {booking.listing?.country}
                    </p>
                    <div className="booking-dates">
                      <div className="date-box">
                        <span className="date-label">Check-in</span>
                        <span className="date-value">{new Date(booking.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="date-arrow">→</div>
                      <div className="date-box">
                        <span className="date-label">Check-out</span>
                        <span className="date-value">{new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="booking-footer">
                      <span className="booking-price">Total: ₹{booking.totalPrice.toLocaleString('en-IN')}</span>
                      {booking.listing && (
                        <Link to={`/listings/${booking.listing._id}`} className="btn btn-outline btn-sm">
                          View Listing
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
