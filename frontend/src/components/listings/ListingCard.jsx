import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toggleWatchlist } from '../../api'
import toast from 'react-hot-toast'
import './ListingCard.css'

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

export default function ListingCard({ listing, showTax }) {
  const { user, setUser } = useAuth()
  const price = listing.price
  
  const isLiked = user?.watchlist?.includes(listing._id)

  const handleToggleWatchlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('You must log in to save listings')
      return
    }
    try {
      const res = await toggleWatchlist(listing._id)
      setUser(prev => ({ ...prev, watchlist: res.data.watchlist }))
      toast.success(res.data.message)
    } catch (err) {
      toast.error('Failed to update watchlist')
    }
  }

  return (
    <article className="listing-card">
      <div className="listing-card-img-wrap">
        <Link to={`/listings/${listing._id}`}>
          <img
            src={listing.image?.url || FALLBACK}
            alt={listing.title}
            className="listing-card-img"
            onError={e => { e.target.src = FALLBACK }}
          />
        </Link>
        <button
          className={`wishlist-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleToggleWatchlist}
          aria-label="Save"
        >
          <i className={`fa-heart ${isLiked ? 'fa-solid' : 'fa-regular'}`} />
        </button>
        <span className="listing-category-badge">{listing.category}</span>
      </div>
      <div className="listing-card-body">
        <Link to={`/listings/${listing._id}`}>
          <h3 className="listing-card-title">{listing.title}</h3>
        </Link>
        <p className="listing-card-location">
          <i className="fa fa-location-dot" /> {listing.location}, {listing.country}
        </p>
        <div className="listing-card-price">
          <span className="price-amount">₹{price.toLocaleString('en-IN')}</span>
          <span className="price-label">/night</span>
          {showTax && (
            <span className="price-tax"> + ₹{Math.round(price * 0.18).toLocaleString('en-IN')} GST</span>
          )}
        </div>
      </div>
    </article>
  )
}
