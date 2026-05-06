import { Link } from 'react-router-dom';
import { Carousel, Row, Col } from 'react-bootstrap';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import Rating from './Rating';
import Loader from './Loader';
import Message from './Message';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='product-carousel mb-4'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`} className='carousel-link'>
            <Row className='align-items-center g-0 carousel-inner-row'>
              {/* Зображення */}
              <Col xs={12} md={5} className='carousel-img-col'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='carousel-product-img'
                />
              </Col>

              {/* Інформація */}
              <Col xs={12} md={7} className='carousel-info-col'>
                <div className='carousel-info-content'>
                  <span className='carousel-badge'>Топ продаж</span>
                  <h2 className='carousel-product-name'>{product.name}</h2>
                  <div className='carousel-rating'>
                    <Rating value={product.rating} />
                    <span className='carousel-reviews'>
                      {product.numReviews} відгуків
                    </span>
                  </div>
                  <p className='carousel-price'>
                    {product.price.toLocaleString('uk-UA')} грн
                  </p>
                  <span className='carousel-cta'>Переглянути →</span>
                </div>
              </Col>
            </Row>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
