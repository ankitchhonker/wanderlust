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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('search')

  // Reset page to 1 when search term changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  useEffect(() => {
    setLoading(true)
    const fetch = searchTerm
      ? searchListings(searchTerm, page)
      : category
        ? fetchListingsByCategory(category, page)
        : fetchListings(page)

    fetch
      .then(res => {
        setListings(res.data.listings)
        setTotalPages(res.data.totalPages || 1)
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [category, searchTerm, page])

  const handleCategory = (val) => {
    if (category !== val) {
      setCategory(val)
      setPage(1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1)
  }

  return (
    <main className="page-wrapper">
      <div className="container">
        {searchTerm && (
          <p className="search-label">
            <i className="fa fa-search" /> Results for "<strong>{searchTerm}</strong>"
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
          <>
            <div className="listings-grid">
              {listings.map(l => (
                <ListingCard key={l._id} listing={l} showTax={showTax} />
              ))}
            </div>

            {totalPages > 0 && (
              <div className="pagination-wrap">
                <button 
                  className="btn btn-outline" 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                >
                  <i className="fa fa-chevron-left" /> Previous
                </button>
                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>
                <button 
                  className="btn btn-outline" 
                  onClick={handleNextPage} 
                  disabled={page >= totalPages}
                >
                  Next <i className="fa fa-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
