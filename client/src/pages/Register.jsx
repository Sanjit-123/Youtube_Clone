import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      })
      const data = res.data?.data || res.data
      login(data.token, data.user)
      showToast('Account created!', 'success')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <svg width="32" height="22" viewBox="0 0 28 20">
            <rect width="28" height="20" rx="4" fill="#FF0000"/>
            <polygon points="11,6 11,14 19,10" fill="white"/>
          </svg>
          <span className="auth-logo-text">YTClone</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">to continue to YouTube</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input id="reg-username" name="username" type="text" className="form-input"
              placeholder="Username" value={form.username} onChange={handleChange}
              minLength={3} maxLength={30} autoComplete="username" />
          </div>
          <div className="form-group">
            <input id="reg-email" name="email" type="email" className="form-input"
              placeholder="Email or phone" value={form.email} onChange={handleChange} autoComplete="email" />
          </div>
          <div className="form-group">
            <input id="reg-password" name="password" type="password" className="form-input"
              placeholder="Password" value={form.password} onChange={handleChange}
              minLength={6} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <input id="reg-confirm" name="confirmPassword" type="password" className="form-input"
              placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange}
              minLength={6} autoComplete="new-password" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
            <Link to="/login" style={{ color: '#3ea6ff', fontSize: '14px', fontWeight: '500' }}>Sign in instead</Link>
            <button type="submit" disabled={loading} id="register-submit-btn" style={{
              background: '#3ea6ff', color: '#000', border: 'none', borderRadius: '40px',
              padding: '0 24px', height: '36px', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
            }}>
              {loading ? 'Wait...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
