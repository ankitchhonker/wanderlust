import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './AuthPage.css'

export default function SignUp() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signUp(form)
      setUser(res.data.user)
      toast.success('Account created! Welcome 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Sign up failed')
    } finally { setLoading(false) }
  }

  return (
    <main className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo-icon">✈</span>
          <span>Wanderlust</span>
        </div>
        <h2 className="auth-title">Create an account</h2>
        <p className="auth-sub">Join thousands of travellers worldwide</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control" type="text"
              placeholder="@yourusername" value={form.username}
              onChange={set('username')} required autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-control" type="email"
              placeholder="you@example.com" value={form.email}
              onChange={set('email')} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control" type="password"
              placeholder="Create a strong password" value={form.password}
              onChange={set('password')} required minLength={6}
            />
          </div>
          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? <><i className="fa fa-spinner fa-spin" /> Creating account…</> : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  )
}
