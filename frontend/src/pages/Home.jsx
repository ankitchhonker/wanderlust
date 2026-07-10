import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchListings, fetchListingsByCategory, searchListings } from '../api'
import ListingCard from '../components/listings/ListingCard'
import CategoryFilter from '../components/listings/CategoryFilter'
import './Home.css'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [showTax, setShowTax] = useState(false)
  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('search')

  useEffect(() => {
    setLoading(true)
    const fetch = searchTerm
      ? searchListings(searchTerm)
      : category
        ? fetchListingsByCategory(category)
        : fetchListings()

    fetch
      .then(res => setListings(res.data.listings))
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [category, searchTerm])

  const handleCategory = (val) => setCategory(val)

  return (
    <main className="page-wrapper">
      <div className="container">
        {searchTerm && (
          <p className="search-label">
            <i className="fa fa-search" /> Results for "<strong>{searchTerm}</strong>"
            &nbsp;— {listings.length} found
          </p>
        )}
        <CategoryFilter
          active={category}
          onChange={handleCategory}
          showTax={showTax}
          onToggleTax={() => setShowTax(t => !t)}
        />

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <i className="fa fa-compass" />
            <p>No listings found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map(l => (
              <ListingCard key={l._id} listing={l} showTax={showTax} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
