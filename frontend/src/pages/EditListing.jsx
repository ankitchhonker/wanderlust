import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchListing, updateListing } from '../api'
import { useAuth } from '../context/AuthContext'
import ListingForm from '../components/listings/ListingForm'
import toast from 'react-hot-toast'
import './FormPage.css'

export default function EditListing() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchListing(id)
      .then(res => setListing(res.data.listing))
      .catch(() => toast.error('Listing not found'))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await updateListing(id, formData)
      toast.success('Listing updated!')
      navigate(`/listings/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (!listing) return <div className="empty-state"><i className="fa fa-triangle-exclamation" /><p>Not found.</p></div>

  const isOwner = user && listing.owner?._id === user._id
  if (!isOwner) return <div className="empty-state"><i className="fa fa-lock" /><p>You don't have permission.</p></div>

  return (
    <main className="form-page page-wrapper">
      <div className="container form-container">
        <div className="form-page-header">
          <h1>Edit listing</h1>
          <p>Update the details of your place</p>
        </div>
        <ListingForm
          initialValues={listing}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  )
}
