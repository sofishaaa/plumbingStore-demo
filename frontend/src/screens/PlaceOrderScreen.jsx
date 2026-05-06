import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Row, Col, ListGroup, Image, Card,
} from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress?.city) navigate('/shipping');
    else if (!cart.paymentMethod) navigate('/payment');
  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const { shippingAddress } = cart;

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            {/* Доставка */}
            <ListGroup.Item>
              <h2>Доставка</h2>
              <p>
                <strong>Місто: </strong> {shippingAddress.city}
              </p>
              {shippingAddress.novaPoshtaBranch && (
                <p>
                  <strong>Відділення НП: </strong>{' '}
                  {shippingAddress.novaPoshtaBranch}
                </p>
              )}
              {shippingAddress.address && (
                <p>
                  <strong>Адреса кур'єра: </strong> {shippingAddress.address}
                </p>
              )}
              <Message variant='info'>
                🚚 Вартість доставки Новою Поштою буде розрахована менеджером та додана до суми замовлення.
              </Message>
            </ListGroup.Item>

            {/* Оплата */}
            <ListGroup.Item>
              <h2>Оплата</h2>
              <strong>Спосіб: </strong> {cart.paymentMethod}
            </ListGroup.Item>

            {/* Товари */}
            <ListGroup.Item>
              <h2>Товари</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Кошик порожній</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className='align-items-center'>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} × {item.price.toLocaleString('uk-UA')} грн ={' '}
                          {(item.qty * item.price).toLocaleString('uk-UA')} грн
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Підсумок */}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Підсумок</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Товари:</Col>
                  <Col>{Number(cart.itemsPrice).toLocaleString('uk-UA')} грн</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Доставка НП:</Col>
                  <Col className='text-muted'>уточнюється менеджером</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>До сплати:</strong>
                  </Col>
                  <Col>
                    <strong>
                      {Number(cart.totalPrice).toLocaleString('uk-UA')} грн
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant='danger'>
                    {error?.data?.message || error.error}
                  </Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block w-100'
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  Підтвердити замовлення
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
