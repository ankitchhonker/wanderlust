import { useState } from 'react'
import { createReview } from '../../api'
import toast from 'react-hot-toast'
import './ReviewForm.css'

export default function ReviewForm({ listingId, onAdded }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please select a star rating')
    if (!comment.trim()) return toast.error('Please write a comment')
    setLoading(true)
    try {
      const res = await createReview(listingId, { rating, comment })
      toast.success('Review added!')
      onAdded(res.data.review)
      setRating(0); setComment('')
    } catch {
      toast.error('Failed to add review')
    } finally { setLoading(false) }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form-title">Share your experience</h3>
      <div className="form-group">
        <label className="form-label">Your rating</label>
        <div className="star-picker">
          {[1,2,3,4,5].map(n => (
            <button
              key={n} type="button"
              className={`star-btn ${n <= (hovered || rating) ? 'on' : ''}`}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(n)}
            >
              <i className="fa-solid fa-star" />
            </button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="comment">Comment</label>
        <textarea
          id="comment" className="form-control"
          placeholder="What did you love about this place?"
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? <><i className="fa fa-spinner fa-spin" /> Posting…</> : 'Post Review'}
      </button>
    </form>
  )
}
