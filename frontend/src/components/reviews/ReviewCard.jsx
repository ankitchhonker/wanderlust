import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { deleteReview } from '../../api'
import ConfirmModal from '../common/ConfirmModal'
import toast from 'react-hot-toast'
import './ReviewCard.css'

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <i key={n} className={`fa-star ${n <= rating ? 'fa-solid filled' : 'fa-regular'}`} />
      ))}
    </div>
  )
}

export default function ReviewCard({ review, listingId, onDelete }) {
  const { user } = useAuth()
  const canDelete = user && review.author?._id === user._id
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false)
    try {
      await deleteReview(listingId, review._id)
      toast.success('Review deleted')
      onDelete(review._id)
    } catch {
      toast.error('Failed to delete review')
    }
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author">
          <div className="review-avatar">
            {review.author?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="review-username">@{review.author?.username || 'Anonymous'}</span>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="review-comment">{review.comment}</p>
      {canDelete && (
        <button className="review-delete-btn" onClick={() => setIsDeleteModalOpen(true)}>
          <i className="fa-solid fa-trash" /> Delete
        </button>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
