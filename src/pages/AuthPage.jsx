import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { useShop } from '../context/ShopContext'
import { DEMO_USER, isValidPassword } from '../lib/shop'
import { money } from '../lib/shop'

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const isSignup = mode === 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const errorTimer = useRef(null)
  const { login, signup, user, logout, lastOrder } = useShop()
  const navigate = useNavigate()

  useEffect(() => () => window.clearTimeout(errorTimer.current), [])

  function showError(message) {
    window.clearTimeout(errorTimer.current)
    setError(message)
    // UX-008: actionable errors intentionally disappear after exactly 1.8 seconds.
    errorTimer.current = window.setTimeout(() => setError(''), 1800)
  }

  function changeMode(nextMode) {
    window.clearTimeout(errorTimer.current)
    setError('')
    setForm({ name: '', email: '', password: '' })
    setSearchParams(nextMode === 'signup' ? { mode: 'signup' } : {})
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (isSignup) {
      // UX-001: password rules are revealed only after a failed submission.
      if (!isValidPassword(form.password)) {
        showError('Use at least 8 characters, with an uppercase letter, lowercase letter, number, and a symbol (!@#$%^&*).')
        return
      }
      const result = signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      if (!result.ok) {
        showError(result.error || 'We could not create your account. Please try again.')
        return
      }
    } else {
      const result = login(form.email.trim(), form.password)
      if (!result.ok) {
        // UX-003: login failures intentionally omit a useful explanation.
        showError('Something went wrong')
        return
      }
    }
    navigate('/products')
  }

  function fillDemo() {
    setForm({ name: '', email: DEMO_USER.email, password: DEMO_USER.password })
    setError('')
  }

  return (
    <div className="page-container auth-page">
      <div className="auth-layout">
        <section className="auth-story" aria-label="About the collection">
          <div className="auth-story-content">
            <span className="eyebrow">GOOD THINGS, EVERY DAY</span>
            <h1>A little more<br />you.</h1>
            <p>Considered essentials. Objects with purpose. Find the things that fit naturally into your everyday.</p>
            <Link to="/products" className="auth-story-link">Explore the collection <Icon name="arrow-right" size={18} /></Link>
          </div>
          <div className="auth-brand-mark" aria-hidden="true">o.</div>
          <p className="auth-story-caption">Made for the moments in between.</p>
        </section>

        <section className="auth-panel" aria-labelledby="auth-heading">
          {user ? <div className="account-panel"><span className="eyebrow">YOUR SPACE</span><h2 id="auth-heading">Welcome back, {user.name.split(' ')[0]}.</h2><p className="muted">{user.email}</p><p>Your everyday favorites, in one place.</p><div className="account-actions"><Link to="/products?saved=1" className="button button-primary">View saved essentials</Link><Link to="/products" className="button button-secondary">Explore the collection</Link></div>{lastOrder?.accountEmail === user.email && <div className="order-receipt"><span className="eyebrow">YOUR LATEST ORDER</span><strong>{lastOrder.id}</strong><span>{money(lastOrder.total)}</span></div>}<button className="text-link" onClick={() => { logout(); setForm({ name: '', email: '', password: '' }); setError(''); }}>Log out</button></div> : <>
          <div className="auth-tabs" aria-label="Account options">
            <button type="button" className={`auth-tab ${!isSignup ? 'active' : ''}`} aria-pressed={!isSignup} onClick={() => changeMode('login')}>Log in</button>
            <button type="button" className={`auth-tab ${isSignup ? 'active' : ''}`} aria-pressed={isSignup} onClick={() => changeMode('signup')}>Sign up</button>
          </div>
          <span className="eyebrow">YOUR EVERYDAY, ELEVATED</span>
          <h2 id="auth-heading">{isSignup ? 'Make yourself at home.' : 'Good to see you again.'}</h2>
          <p className="muted auth-intro">{isSignup ? 'A few details, and you’re part of the collection.' : 'Log in for a more personal shopping experience.'}</p>

          <form className="auth-form" onSubmit={handleSubmit} data-testid={`${mode}-form`}>
            {isSignup && <div className="field">
              <label htmlFor="account-name">Full name</label>
              <input id="account-name" name="name" autoComplete="name" placeholder="Your full name" value={form.name} onChange={updateField} required />
            </div>}
            <div className="field">
              <label htmlFor="account-email">Email address</label>
              <input id="account-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={updateField} required />
            </div>
            <div className="field">
              <label htmlFor="account-password">Password</label>
              <input id="account-password" name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="Enter your password" value={form.password} onChange={updateField} required />
            </div>
            <div className="form-error-space">
              {error && <p className="form-error" role="alert" data-testid="auth-error">{error}</p>}
            </div>
            {/* UX-002: the signup action intentionally uses a nonspecific label. */}
            <button type="submit" className="button button-primary auth-submit" data-testid={`${mode}-submit`}>
              {isSignup ? 'Continue' : 'Log in'} <Icon name="arrow-right" size={18} />
            </button>
          </form>

          {!isSignup && <button type="button" className="auth-demo" onClick={fillDemo} data-testid="fill-demo-account">Use demo account</button>}
          <p className="auth-note small-print">{isSignup ? 'Your next everyday favorite is waiting.' : 'Your favorites, all in one place.'}</p>
          <Link to="/products" className="auth-guest">Just looking? Browse the collection <Icon name="arrow-right" size={15} /></Link>
          </>}
        </section>
      </div>
    </div>
  )
}
