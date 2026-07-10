import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createListing } from '../api'
import ListingForm from '../components/listings/ListingForm'
import toast from 'react-hot-toast'
import './FormPage.css'

export default function NewListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  if (!user) return (
    <div className="form-page page-wrapper">
      <div className="container form-container">
        <div className="empty-state">
          <i className="fa fa-lock" />
          <p>You must be <Link to="/login">logged in</Link> to add a listing.</p>
        </div>
      </div>
    </div>
  )

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await createListing(formData)
      toast.success('Listing created!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create listing')
    } finally { setLoading(false) }
  }

  return (
    <main className="form-page page-wrapper">
      <div className="container form-container">
        <div className="form-page-header">
          <h1>Add your place</h1>
          <p>Share your space with travellers around the world</p>
        </div>
        <ListingForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Listing" />
      </div>
    </main>
  )
}
