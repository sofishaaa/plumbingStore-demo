import SHOP from '../config/shop';

// Реквізити продавця — обов'язкові для інтернет-магазину (ЗУ «Про електронну комерцію»)
const SellerDetails = () => (
  <ul className='legal-details'>
    <li><strong>Продавець:</strong> {SHOP.legalName || '—'}</li>
    <li><strong>РНОКПП / ЄДРПОУ:</strong> {SHOP.taxId || '—'}</li>
    <li><strong>Місцезнаходження:</strong> {SHOP.legalAddress || '—'}</li>
    <li><strong>Адреса магазину:</strong> {SHOP.address}</li>
    <li>
      <strong>Телефон:</strong> <a href={`tel:${SHOP.phoneHref}`}>{SHOP.phone}</a>
    </li>
    <li>
      <strong>Email:</strong>{' '}
      {SHOP.email ? <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a> : '—'}
    </li>
  </ul>
);

export default SellerDetails;
