import { Link, useParams } from 'react-router-dom';
import {
  Row, Col, ListGroup, Image, Card, Button,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Статус оновлено: доставлено');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1>Замовлення #{order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            {/* Доставка */}
            <ListGroup.Item>
              <h2>Доставка</h2>
              <p><strong>Отримувач: </strong>{order.user.name}</p>
              <p><strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p><strong>Місто: </strong>{order.shippingAddress.city}</p>
              {order.shippingAddress.novaPoshtaBranch && (
                <p><strong>Відділення НП: </strong>{order.shippingAddress.novaPoshtaBranch}</p>
              )}
              {order.shippingAddress.address && (
                <p><strong>Адреса: </strong>{order.shippingAddress.address}</p>
              )}
              {order.isDelivered ? (
                <Message variant='success'>
                  Доставлено {new Date(order.deliveredAt).toLocaleDateString('uk-UA')}
                </Message>
              ) : (
                <Message variant='warning'>Очікує доставки</Message>
              )}
            </ListGroup.Item>

            {/* Оплата */}
            <ListGroup.Item>
              <h2>Оплата</h2>
              <p><strong>Спосіб: </strong>{order.paymentMethod}</p>
              {order.isPaid ? (
                <Message variant='success'>
                  Оплачено {new Date(order.paidAt).toLocaleDateString('uk-UA')}
                </Message>
              ) : (
                <Message variant='warning'>Не оплачено</Message>
              )}
            </ListGroup.Item>

            {/* Товари */}
            <ListGroup.Item>
              <h2>Товари</h2>
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className='align-items-center'>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} × {Number(item.price).toLocaleString('uk-UA')} грн ={' '}
                        {(item.qty * item.price).toLocaleString('uk-UA')} грн
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Підсумок */}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Підсумок</h2></ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Товари:</Col>
                  <Col>{Number(order.itemsPrice).toLocaleString('uk-UA')} грн</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Доставка НП:</Col>
                  <Col>
                    {order.shippingConfirmed
                      ? `${Number(order.shippingPrice).toLocaleString('uk-UA')} грн`
                      : <span className='text-muted'>уточнюється менеджером</span>
                    }
                  </Col>
                </Row>
              </ListGroup.Item>

              {order.managerNote && (
                <ListGroup.Item>
                  <small className='text-muted'>
                    💬 {order.managerNote}
                  </small>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col><strong>Разом:</strong></Col>
                  <Col>
                    <strong>{Number(order.totalPrice).toLocaleString('uk-UA')} грн</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* Кнопка адміна — позначити як доставлено */}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn w-100'
                    onClick={deliverOrderHandler}
                    disabled={loadingDeliver}
                  >
                    Позначити як доставлено
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
