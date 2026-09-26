import { Link } from 'react-router-dom';
import Meta from './Meta';
import Message from './Message';
import SHOP, { isSellerInfoComplete } from '../config/shop';

const LegalPage = ({ title, description, showRevision = false, children }) => (
  <article className='legal-page'>
    <Meta title={`${title} | ${SHOP.name}`} description={description} />
    <Link className='btn btn-light my-3' to='/'>
      ← На головну
    </Link>
    <h1>{title}</h1>
    {showRevision && (
      <p className='legal-revision'>Редакція від {SHOP.legalRevisionDate}</p>
    )}
    {!isSellerInfoComplete && (
      <Message variant='warning'>
        Реквізити продавця ще не заповнені (frontend/src/config/shop.js).
      </Message>
    )}
    {children}
  </article>
);

export default LegalPage;
