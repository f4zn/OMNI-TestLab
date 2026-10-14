import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import OrderSummary from '../components/OrderSummary'
import { useShop } from '../context/ShopContext'
import { money } from '../lib/shop'

const steps = [
  { id: 'shipping', label: 'Delivery' },
  { id: 'contact', label: 'Contact' },
  { id: 'review', label: 'Review' },
  { id: 'confirmation', label: 'Confirm' },
  { id: 'final-confirmation', label: 'Complete' },
]

export default function CheckoutPage() {
  const { user, cartItems, total, completeOrder } = useShop()
  const [step, setStep] = useState(0)
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '', email: user?.email || '', address: '', city: '', postalCode: '', country: 'United States',
  })
  const [contact, setContact] = useState({ name: '', email: '' })
  const [payment, setPayment] = useState('demo-card')
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [completedOrder, setCompletedOrder] = useState(null)
  const errorTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(errorTimer.current), [])

  function clearError() {
    window.clearTimeout(errorTimer.current)
    setError('')
  }

  function showError(message) {
    window.clearTimeout(errorTimer.current)
    setError(message)
    // UX-008: errors vanish quickly, including mismatched repeated contact details.
    errorTimer.current = window.setTimeout(() => setError(''), 1800)
  }

  function goToStep(nextStep) {
    clearError()
    setStep(nextStep)
    if (nextStep <= 3) setOrderConfirmed(false)
    if (nextStep <= 2) setDeliveryConfirmed(false)
  }

  function updateShipping(event) {
    const { name, value } = event.target
    setShippingDetails((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (step === 0) {
      if (Object.values(shippingDetails).some((value) => !value.trim())) {
        showError('Please complete your delivery details.')
        return
      }
      // UX-011: confirmation fields are deliberately blank, even for signed-in users.
      setContact({ name: '', email: '' })
      goToStep(1)
    } else if (step === 1) {
      if (contact.name.trim() !== shippingDetails.name.trim() || contact.email.trim().toLowerCase() !== shippingDetails.email.trim().toLowerCase()) {
        showError('Your contact details must match the delivery details.')
        return
      }
      goToStep(2)
    } else if (step === 2) {
      goToStep(3)
    } else if (step === 3) {
      if (!deliveryConfirmed) {
        showError('Please confirm your delivery details to continue.')
        return
      }
      goToStep(4)
    } else if (step === 4) {
      if (!orderConfirmed) {
        showError('Please confirm your order to continue.')
        return
      }
      const order = completeOrder({
        shippingDetails: { ...shippingDetails },
        contact: { ...contact },
        paymentMethod: payment === 'demo-card' ? 'OMNI card ending in 4242' : 'Pay on delivery',
      })
      clearError()
      setCompletedOrder(order)
    }
  }

  if (completedOrder) {
    return (
      <div className="page-container checkout-success" data-testid="checkout-success">
        <section className="checkout-confirmation form-panel">
          <div className="success-mark"><Icon name="check" size={30} /></div>
          <span className="eyebrow">A GOOD CHOICE</span>
          <h1>Good things are on their way.</h1>
          <p>Thank you, {completedOrder.shippingDetails.name.split(' ')[0]}. Your order has been placed.</p>
          <div className="order-receipt">
            <div><span className="muted">Order number</span><strong data-testid="order-number">{completedOrder.id}</strong></div>
            <div><span className="muted">Order total</span><strong data-testid="order-total">{money(completedOrder.total)}</strong></div>
            <div><span className="muted">Delivering to</span><strong>{completedOrder.shippingDetails.city}, {completedOrder.shippingDetails.country}</strong></div>
          </div>
          <p className="muted">Your next everyday favorite is one step closer.</p>
          <Link to="/products" className="button button-primary">Keep exploring <Icon name="arrow-right" size={18} /></Link>
        </section>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <section className="empty-state">
          <Icon name="package" size={44} />
          <h1>A little room for something good.</h1>
          <p className="muted">Add an everyday favorite to your bag to get started.</p>
          <Link to="/products" className="button button-primary">Explore the collection <Icon name="arrow-right" size={18} /></Link>
        </section>
      </div>
    )
  }

  const stepTitle = ['Where should we send it?', 'Let’s confirm your details.', 'Everything in its place.', 'One more look.', 'You’re almost there.'][step]
  const stepDescription = [
    'A few details to bring your everyday essentials home.',
    'Enter your contact details again to confirm your delivery information.',
    'Review your delivery details and choose how you’d like to pay.',
    'Confirm the delivery information below before continuing.',
    'Confirm your order details to finish checking out.',
  ][step]
  const buttonText = ['Continue to contact', 'Continue to review', 'Confirm details', 'Continue to final check', 'Place order'][step]

  return (
    <div className="page-container checkout-page">
      <div className="page-heading">
        <div><span className="eyebrow">THE FINAL DETAILS</span><h1>Make it yours.</h1></div>
        <Link to="/cart" className="text-link"><Icon name="arrow-left" size={16} /> Back to bag</Link>
      </div>

      <ol className="stepper" aria-label="Checkout progress">
        {steps.map((item, index) => <li key={item.id} className={`${index === step ? 'active' : ''} ${index < step ? 'complete' : ''}`} aria-current={index === step ? 'step' : undefined}>
          <span className="step-number">{index < step ? <Icon name="check" size={14} /> : index + 1}</span>
          <span>{item.label}</span>
        </li>)}
      </ol>

      {/* UX-014 and UX-015: narrow-screen spacing and primary action placement are controlled in CSS. */}
      <div className="checkout-layout">
        <section className="form-panel checkout-main" aria-labelledby="checkout-step-heading" data-testid={`checkout-step-${steps[step].id}`}>
          <div className="checkout-step-intro"><span className="eyebrow">STEP {String(step + 1).padStart(2, '0')} OF 05</span><h2 id="checkout-step-heading">{stepTitle}</h2><p className="muted">{stepDescription}</p></div>

          <form onSubmit={handleSubmit} data-testid="checkout-form">
            {step === 0 && <div className="field-grid checkout-fields">
              <div className="field"><label htmlFor="delivery-name">Full name</label><input id="delivery-name" name="name" autoComplete="name" value={shippingDetails.name} onChange={updateShipping} required placeholder="Alex Morgan" /></div>
              <div className="field"><label htmlFor="delivery-email">Email address</label><input id="delivery-email" name="email" type="email" autoComplete="email" value={shippingDetails.email} onChange={updateShipping} required placeholder="alex@example.com" /></div>
              <div className="field field-full"><label htmlFor="delivery-address">Street address</label><input id="delivery-address" name="address" autoComplete="street-address" value={shippingDetails.address} onChange={updateShipping} required placeholder="42 Willow Lane" /></div>
              <div className="field"><label htmlFor="delivery-city">City</label><input id="delivery-city" name="city" autoComplete="address-level2" value={shippingDetails.city} onChange={updateShipping} required placeholder="Portland" /></div>
              <div className="field"><label htmlFor="delivery-postal">Postal code</label><input id="delivery-postal" name="postalCode" autoComplete="postal-code" value={shippingDetails.postalCode} onChange={updateShipping} required placeholder="97205" /></div>
              <div className="field field-full"><label htmlFor="delivery-country">Country</label><select id="delivery-country" name="country" autoComplete="country-name" value={shippingDetails.country} onChange={updateShipping}><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Pakistan</option><option>Australia</option></select></div>
            </div>}

            {step === 1 && <div className="field-grid checkout-fields">
              <div className="field"><label htmlFor="confirm-name">Full name</label><input id="confirm-name" name="confirmationName" autoComplete="off" value={contact.name} onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))} required placeholder="Enter your full name again" /></div>
              <div className="field"><label htmlFor="confirm-email">Email address</label><input id="confirm-email" name="confirmationEmail" type="email" autoComplete="off" value={contact.email} onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))} required placeholder="Enter your email again" /></div>
            </div>}

            {step === 2 && <>
              <div className="order-detail-grid">
                <div className="order-detail-block"><h3>Delivering to</h3><p>{shippingDetails.name}<br />{shippingDetails.address}<br />{shippingDetails.city}, {shippingDetails.postalCode}<br />{shippingDetails.country}</p><button type="button" className="text-link" onClick={() => goToStep(0)}>Edit details</button></div>
                <div className="order-detail-block"><h3>Contact details</h3><p>{contact.name}<br />{contact.email}</p><button type="button" className="text-link" onClick={() => goToStep(1)}>Edit contact</button></div>
              </div>
              <fieldset className="payment-options"><legend>Payment method</legend>
                <label className={`payment-option ${payment === 'demo-card' ? 'selected' : ''}`}><input type="radio" name="payment" value="demo-card" checked={payment === 'demo-card'} onChange={(event) => setPayment(event.target.value)} /><span><strong>OMNI card ending in 4242</strong><small>Saved payment method</small></span><Icon name="lock" size={18} /></label>
                <label className={`payment-option ${payment === 'delivery' ? 'selected' : ''}`}><input type="radio" name="payment" value="delivery" checked={payment === 'delivery'} onChange={(event) => setPayment(event.target.value)} /><span><strong>Pay on delivery</strong><small>Pay when your order arrives</small></span></label>
              </fieldset>
            </>}

            {/* UX-009: two separate, redundant confirmation stages follow the review. */}
            {step === 3 && <div className="confirmation-card">
              <Icon name="package" size={28} />
              <h3>Your delivery details</h3>
              <p>{shippingDetails.name}<br />{shippingDetails.address}<br />{shippingDetails.city}, {shippingDetails.postalCode}<br />{shippingDetails.country}</p>
              <p className="muted">{shippingDetails.email}</p>
              <label className="confirmation-check"><input type="checkbox" checked={deliveryConfirmed} onChange={(event) => setDeliveryConfirmed(event.target.checked)} data-testid="confirm-delivery-checkbox" /><span>I confirm these delivery details are correct.</span></label>
            </div>}

            {step === 4 && <div className="confirmation-card">
              <Icon name="check-circle" size={28} />
              <h3>Ready for your everyday.</h3>
              <p>{cartItems.reduce((count, item) => count + item.quantity, 0)} items · {money(total)}</p>
              <p className="muted">{payment === 'demo-card' ? 'OMNI card ending in 4242' : 'Pay on delivery'}</p>
              <label className="confirmation-check"><input type="checkbox" checked={orderConfirmed} onChange={(event) => setOrderConfirmed(event.target.checked)} data-testid="confirm-order-checkbox" /><span>I have reviewed my order and am ready to continue.</span></label>
            </div>}

            <div className="form-error-space">{error && <p className="form-error" role="alert" data-testid="checkout-error">{error}</p>}</div>
            <div className="checkout-actions">
              {step > 0 ? <button type="button" className="text-link" onClick={() => goToStep(step - 1)} data-testid="checkout-back"><Icon name="arrow-left" size={16} /> Back</button> : <span />}
              <button type="submit" className="button button-primary checkout-primary" data-testid={`checkout-next-${steps[step].id}`}>{buttonText}<Icon name="arrow-right" size={17} /></button>
            </div>
          </form>
        </section>

        <aside className="checkout-aside"><OrderSummary><p className="small-print checkout-summary-note">By placing your order, you agree to our store terms. Delivery times are estimates.</p></OrderSummary></aside>
      </div>
    </div>
  )
}
