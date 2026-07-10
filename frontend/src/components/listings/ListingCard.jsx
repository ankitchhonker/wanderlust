import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ListingCard.css'

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

export default function ListingCard({ listing, showTax }) {
  const [liked, setLiked] = useState(false)
  const price = listing.price

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
          className={`wishlist-btn ${liked ? 'liked' : ''}`}
          onClick={() => setLiked(l => !l)}
          aria-label="Save"
        >
          <i className={`fa-heart ${liked ? 'fa-solid' : 'fa-regular'}`} />
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
