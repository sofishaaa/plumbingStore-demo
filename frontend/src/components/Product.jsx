import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ Product: product }) => {
  return (
    <Card className='my-3 p-3 rounded h-90'>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          variant='top'
          style={{ height: '200px', objectFit: 'contain' }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} відгуків`}
          />
        </Card.Text>

        <Card.Text as='h3'>
          {product.price.toLocaleString('uk-UA')} грн
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
