import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchListing, deleteListing, createBooking, toggleWatchlist } from '../api'
import { useAuth } from '../context/AuthContext'
import MapBox from '../components/listings/MapBox'
import ReviewCard from '../components/reviews/ReviewCard'
import ReviewForm from '../components/reviews/ReviewForm'
import ConfirmModal from '../components/common/ConfirmModal'
import toast from 'react-hot-toast'
import './ListingShow.css'

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80'

export default function ListingShow() {
  const { id } = useParams()
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // Booking states
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const isLiked = user?.watchlist?.includes(id)

  const handleToggleWatchlist = async () => {
    if (!user) {
      toast.error('You must log in to save listings')
      return
    }
    try {
      const res = await toggleWatchlist(id)
      setUser(prev => ({ ...prev, watchlist: res.data.watchlist }))
      toast.success(res.data.message)
    } catch (err) {
      toast.error('Failed to update watchlist')
    }
  }

  useEffect(() => {
    fetchListing(id)
      .then(res => setListing(res.data.listing))
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false))
  }, [id])

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false)
    try {
      await deleteListing(id)
      toast.success('Listing deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete listing')
    }
  }

  const handleReviewAdded = (review) => {
    setListing(prev => ({ ...prev, reviews: [...prev.reviews, review] }))
  }

  const handleReviewDeleted = (reviewId) => {
    setListing(prev => ({ ...prev, reviews: prev.reviews.filter(r => r._id !== reviewId) }))
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (!listing) return <div className="empty-state"><i className="fa fa-triangle-exclamation" /><p>Listing not found.</p></div>

  const isOwner = user && listing.owner?._id === user._id
  const avgRating = listing.reviews?.length
    ? (listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length).toFixed(1)
    : null

  // Calculate total days and price
  let totalDays = 0;
  if (checkIn && checkOut) {
    const diff = new Date(checkOut) - new Date(checkIn);
    totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  const calculatedDays = totalDays > 0 ? totalDays : 1;
  const basePrice = listing.price * calculatedDays;
  const gst = Math.round(basePrice * 0.18);
  const finalPrice = basePrice + gst;

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error('Check-out must be after check-in');
      return;
    }

    setBookingLoading(true);
    try {
      await createBooking({
        listingId: listing._id,
        checkIn,
        checkOut,
        totalPrice: finalPrice
      });
      toast.success('Booking confirmed! Check your profile.');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to book');
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Explore</Link>
          <i className="fa fa-chevron-right" />
          <span>{listing.title}</span>
        </nav>

        {/* Title row */}
        <div className="show-header">
          <div>
            <h1 className="show-title">{listing.title}</h1>
            <div className="show-meta">
              {avgRating && (
                <span className="show-rating">
                  <i className="fa-solid fa-star" /> {avgRating} · {listing.reviews.length} review{listing.reviews.length !== 1 ? 's' : ''}
                </span>
              )}
              <span className="show-location">
                <i className="fa fa-location-dot" />
                <a href={`https://www.google.com/search?q=${listing.title} ${listing.location}`} target="_blank" rel="noreferrer">
                  {listing.location}, {listing.country}
                </a>
              </span>
              <span className="badge badge-brand">{listing.category}</span>
            </div>
          </div>
          <div className="show-actions-wrap" style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={handleToggleWatchlist} 
              style={{
                borderColor: isLiked ? 'var(--brand)' : 'var(--border)', 
                color: isLiked ? 'var(--brand)' : 'var(--ink)'
              }}
            >
              <i className={`fa-heart ${isLiked ? 'fa-solid' : 'fa-regular'}`} /> {isLiked ? 'Saved' : 'Save'}
            </button>
            {isOwner && (
              <>
                <Link to={`/listings/${id}/edit`} className="btn btn-outline btn-sm">
                  <i className="fa fa-pen" /> Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => setIsDeleteModalOpen(true)}>
                  <i className="fa fa-trash" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hero image */}
        <div className="show-img-wrap">
          <img
            src={listing.image?.url || FALLBACK}
            alt={listing.title}
            className="show-img"
            onError={e => { e.target.src = FALLBACK }}
          />
        </div>

        {/* Two column layout */}
        <div className="show-grid">
          {/* Left: details */}
          <div className="show-details">
            <div className="show-host">
              <div className="host-avatar">{listing.owner?.username?.[0]?.toUpperCase()}</div>
              <div>
                <p className="host-label">Hosted by</p>
                <p className="host-name">{listing.owner?.username}</p>
              </div>
            </div>

            <hr className="divider" />

            <p className="show-description">{listing.description}</p>

            <hr className="divider" />

            <MapBox listing={listing} />
          </div>

          {/* Right: price card */}
          <aside className="show-sidebar">
            <div className="price-card">
              <div className="price-card-top">
                <span className="price-big">₹{listing.price.toLocaleString('en-IN')}</span>
                <span className="price-per">/night</span>
              </div>
              <div className="booking-inputs" style={{display:'flex', flexDirection:'column', gap:'10px', margin:'15px 0'}}>
                <div>
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>CHECK-IN</label>
                  <input type="date" className="form-control" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>CHECK-OUT</label>
                  <input type="date" className="form-control" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="price-breakdown">
                <div className="price-row"><span>₹{listing.price.toLocaleString('en-IN')} x {calculatedDays} night{calculatedDays !== 1 ? 's' : ''}</span><span>₹{basePrice.toLocaleString('en-IN')}</span></div>
                <div className="price-row"><span>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
                <div className="price-row total"><span>Total</span><span>₹{finalPrice.toLocaleString('en-IN')}</span></div>
              </div>
              {user ? (
                <button className="btn btn-primary" onClick={handleReserve} disabled={bookingLoading} style={{width:'100%',justifyContent:'center', marginTop:'15px'}}>
                  {bookingLoading ? 'Reserving...' : 'Reserve'}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary" style={{width:'100%',justifyContent:'center', marginTop:'15px'}}>
                  Login to Reserve
                </Link>
              )}
              <p className="price-note">You won't be charged yet</p>
            </div>
          </aside>
        </div>

        {/* Reviews section */}
        <section className="reviews-section">
          <h2 className="reviews-heading">
            <i className="fa-solid fa-star" />
            {avgRating ? ` ${avgRating} · ` : ' '}
            {listing.reviews.length} Review{listing.reviews.length !== 1 ? 's' : ''}
          </h2>

          {listing.reviews.length > 0 ? (
            <div className="reviews-grid">
              {listing.reviews.map(review => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  listingId={id}
                  onDelete={handleReviewDeleted}
                />
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          )}

          {user ? (
            <div className="review-form-wrap">
              <ReviewForm listingId={id} onAdded={handleReviewAdded} />
            </div>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to leave a review.
            </p>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </main>
  )
}
