import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem } from 'react-bootstrap';
import Rating from '../components/Rating';
import products from '../products';
import React from 'react';

export const ProductScreen = () => {
  const { id: productId } = useParams();
  const product = products.find((p) => p._id === productId);
  console.log(product);

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
       Назад
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </ListGroup.Item>
            <ListGroup.Item>Ціна: {product.price} грн.</ListGroup.Item>
            <ListGroupItem>{product.description}</ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={3}>
        <Card>
  <ListGroup variant='flush'>
    <ListGroup.Item>
      <Row>
        <Col>Ціна:</Col>
        <Col><strong>{product.price} грн.</strong></Col>
      </Row>
    </ListGroup.Item>
    <ListGroup.Item>
      <Row>
        <Col>Статус:</Col>
        <Col>
          {product.countInStock > 0 ? 'В наявності' : 'Немає в наявності'}
        </Col>
      </Row>
    </ListGroup.Item>
    <ListGroupItem>
      <Button
        className='btn-block'
        type='button'
        disabled={product.countInStock === 0}
      >
        Додати в кошик
      </Button>
    </ListGroupItem>
  </ListGroup>
</Card>
        </Col>
      </Row>
    </>
  )
};
export default ProductScreen;
