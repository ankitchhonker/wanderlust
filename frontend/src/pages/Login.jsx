import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './AuthPage.css'

export default function Login() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      setUser(res.data.user)
      toast.success(`Welcome back, ${res.data.user.username}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid username or password')
    } finally { setLoading(false) }
  }

  return (
    <main className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo-icon">✈</span>
          <span>Wanderlust</span>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Login to continue your journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control" type="text"
              placeholder="@username" value={form.username}
              onChange={set('username')} required autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control" type="password"
              placeholder="••••••••" value={form.password}
              onChange={set('password')} required
            />
          </div>
          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? <><i className="fa fa-spinner fa-spin" /> Logging in…</> : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  )
}
