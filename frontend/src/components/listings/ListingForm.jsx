import { useState, useRef } from 'react'
import { generateDescription } from '../../api'
import toast from 'react-hot-toast'
import './ListingForm.css'

const CATEGORIES = [
  'Beachfront','Lakefronts','trending','Mountains',
  'Treehouse','Cabin','Desert','Cottage','Historicalhomes','Beach','Rooms'
]
const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

export default function ListingForm({ initialValues = {}, onSubmit, loading, submitLabel }) {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    price: initialValues.price || '',
    location: initialValues.location || '',
    country: initialValues.country || '',
    category: initialValues.category || 'Beachfront',
    lat: initialValues.geometry?.coordinates?.[1] || '',
    lng: initialValues.geometry?.coordinates?.[0] || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialValues.image?.url || null)
  const [aiLoading, setAiLoading] = useState(false)
  const fileRef = useRef()

   
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }))
        toast.success('Location fetched!')
      },
      err => toast.error('Location error: ' + err.message)
    )
  }

  const handleGenerateAI = async () => {
    if (!form.title) return toast.error('Enter a title first')
    setAiLoading(true)
    try {
      const res = await generateDescription({
        title: form.title, location: form.location,
        country: form.country, category: form.category, price: form.price,
      })
      setForm(f => ({ ...f, description: res.data.description }))
      toast.success('Description generated!')
    } catch {
      toast.error('AI generation failed')
    } finally { setAiLoading(false) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    if (imageFile) data.append('image', imageFile)
    onSubmit(data)
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit} encType="multipart/form-data">

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className="form-control" type="text" placeholder="e.g. Cozy beach cottage" value={form.title} onChange={set('title')} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location *</label>
          <input className="form-control" type="text" placeholder="e.g. Goa" value={form.location} onChange={set('location')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Country *</label>
          <input className="form-control" type="text" placeholder="e.g. India" value={form.country} onChange={set('country')} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Price per night (₹) *</label>
          <input className="form-control" type="number" placeholder="e.g. 3500" value={form.price} onChange={set('price')} required min="0" />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-control" value={form.category} onChange={set('category')} required>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Coordinates */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Latitude</label>
          <input className="form-control" type="number" step="any" placeholder="e.g. 15.2993" value={form.lat} onChange={set('lat')} />
        </div>
        <div className="form-group">
          <label className="form-label">Longitude</label>
          <input className="form-control" type="number" step="any" placeholder="e.g. 74.1240" value={form.lng} onChange={set('lng')} />
        </div>
      </div>
      <button type="button" className="btn btn-outline btn-sm location-btn" onClick={getCurrentLocation}>
        <i className="fa fa-location-crosshairs" /> Use my current location
      </button>

      {/* Description */}
      <div className="form-group" style={{marginTop:'1rem'}}>
        <div className="desc-label-row">
          <label className="form-label">Description *</label>
          <button type="button" className="btn-ai" onClick={handleGenerateAI} disabled={aiLoading}>
            {aiLoading ? <><i className="fa fa-spinner fa-spin" /> Generating…</> : <><i className="fa-solid fa-wand-magic-sparkles" /> AI Generate</>}
          </button>
        </div>
        <textarea className="form-control" rows={4} placeholder="Describe what makes this place special…" value={form.description} onChange={set('description')} required />
      </div>

      {/* Image upload */}
      <div className="form-group">
        <label className="form-label">Listing Image</label>
        {imagePreview && (
          <div className="img-preview-wrap">
            <img src={imagePreview} alt="Preview" className="img-preview" onError={e=>{e.target.src=FALLBACK}} />
            <span className="img-preview-label">Preview</span>
          </div>
        )}
        <input ref={fileRef} type="file" className="form-control" accept="image/*" onChange={handleImage} />
      </div>

      <button className="btn btn-primary submit-btn" type="submit" disabled={loading}>
        {loading
          ? <><i className="fa fa-spinner fa-spin" /> Saving…</>
          : submitLabel || 'Submit'}
      </button>
    </form>
  )
}
