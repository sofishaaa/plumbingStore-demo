import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, ListGroup, Image, Form, Button, Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 className='mb-3'>Кошик</h1>
        {cartItems.length === 0 ? (
          <Message>
            Кошик порожній. <Link to='/'>Перейти до покупок</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className='align-items-center'>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={4}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    {item.price.toLocaleString('uk-UA')} грн
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(Math.min(item.countInStock, 10)).keys()].map(
                        (x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        )
                      )}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Разом ({cartItems.reduce((a, c) => a + c.qty, 0)} товарів)
              </h2>
              <strong>{itemsPrice.toLocaleString('uk-UA')} грн</strong>
            </ListGroup.Item>
            <ListGroup.Item>
              <small className='text-muted'>
                🚚 Доставка Новою Поштою — розраховується менеджером після оформлення
              </small>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block w-100'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Оформити замовлення
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
