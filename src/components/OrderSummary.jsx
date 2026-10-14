import { useShop } from '../context/ShopContext';
import { money } from '../lib/shop';
import Icon from './Icon';

export default function OrderSummary({ children }) {
  const { subtotal, shipping, total, cartItems } = useShop();
  return <aside className="order-summary"><span className="eyebrow">THE LITTLE DETAILS</span><h2>Order summary</h2><div className="summary-row"><span>Subtotal <span className="muted">({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span></span><span>{money(subtotal)}</span></div><div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Complimentary' : money(shipping)}</span></div><div className="summary-row"><span>Taxes</span><span>Included</span></div><div className="summary-total"><span>Total</span><strong>{money(total)} <small>USD</small></strong></div>{children}
    {/* UX-005: important fulfillment information is unusually small. */}
    <p className="small-print">Standard delivery: 3–5 business days. Shipping is $8 for orders below $100. Prices include applicable taxes.</p><div className="summary-secure"><Icon name="lock" size={14} /> A little peace of mind, included.</div></aside>;
}
