import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ Product: product }) => {
  return (
    <Card className='my-3 product-card'>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
        <Card.Img
          src={product.image}
          variant='top'
          style={{ height: '200px', objectFit: 'contain', padding: '12px' }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className='product-card-title'>
          <Card.Title as='div' className='product-title mb-2'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} відгуків`}
          />
        </Card.Text>

        <p className='product-price mb-0'>
          {product.price.toLocaleString('uk-UA')} грн
        </p>
      </Card.Body>
    </Card>
  );
};

export default Product;
