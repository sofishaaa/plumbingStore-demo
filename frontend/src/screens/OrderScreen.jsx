import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Row, Col, ListGroup, Image, Card, Button, Form, InputGroup,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useSetTrackingNumberMutation,
  useCancelOrderMutation,
} from '../slices/ordersApiSlice';
import SHOP, { isBankInfoComplete } from '../config/shop';
import { orderLabel, trackingUrl } from '../utils/orderUtils';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [trackingInput, setTrackingInput] = useState('');
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [setTrackingNumber, { isLoading: loadingTracking }] =
    useSetTrackingNumberMutation();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const payOrderHandler = async () => {
    try {
      await payOrder(orderId).unwrap();
      refetch();
      toast.success('Статус оновлено: оплачено');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const trackingHandler = async (e) => {
    e.preventDefault();
    try {
      await setTrackingNumber({ orderId, trackingNumber: trackingInput }).unwrap();
      refetch();
      setTrackingInput('');
      toast.success('ТТН збережено, клієнту надіслано лист');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const cancelOrderHandler = async () => {
    const reason = window.prompt(
      'Скасувати замовлення? Товари повернуться на склад.\nПричина (необов\'язково):'
    );
    if (reason === null) return;
    try {
      await cancelOrder({ orderId, reason }).unwrap();
      refetch();
      toast.success('Замовлення скасовано');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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
      <h1>Замовлення {orderLabel(order)}</h1>
      <p className='text-muted'>
        від {new Date(order.createdAt).toLocaleDateString('uk-UA')}
      </p>
      {order.isCancelled && (
        <Message variant='danger'>
          Замовлення скасовано{' '}
          {new Date(order.cancelledAt).toLocaleDateString('uk-UA')}
          {order.cancelReason && `. Причина: ${order.cancelReason}`}
        </Message>
      )}
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
              {order.shippingAddress.phone && (
                <p><strong>Телефон: </strong>
                  <a href={`tel:${order.shippingAddress.phone}`}>{order.shippingAddress.phone}</a>
                </p>
              )}
              <p><strong>Місто: </strong>{order.shippingAddress.city}</p>
              {order.shippingAddress.novaPoshtaBranch && (
                <p><strong>Відділення НП: </strong>{order.shippingAddress.novaPoshtaBranch}</p>
              )}
              {order.shippingAddress.address && (
                <p><strong>Адреса: </strong>{order.shippingAddress.address}</p>
              )}
              {order.trackingNumber && (
                <p>
                  <strong>ТТН Нової Пошти: </strong>
                  <a
                    href={trackingUrl(order.trackingNumber)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {order.trackingNumber}
                  </a>
                </p>
              )}
              {order.isDelivered ? (
                <Message variant='success'>
                  Доставлено {new Date(order.deliveredAt).toLocaleDateString('uk-UA')}
                </Message>
              ) : order.trackingNumber ? (
                <Message variant='info'>
                  Відправлено {new Date(order.shippedAt).toLocaleDateString('uk-UA')}
                </Message>
              ) : (
                !order.isCancelled && <Message variant='warning'>Очікує відправлення</Message>
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

              {/* Реквізити для оплати переказом */}
              {order.paymentMethod === 'Банківський переказ' &&
                !order.isPaid &&
                !order.isCancelled &&
                (!order.shippingConfirmed ? (
                  <p className='text-muted'>
                    Реквізити для оплати з'являться тут після того, як менеджер
                    підтвердить замовлення та вартість доставки.
                  </p>
                ) : isBankInfoComplete ? (
                  <div className='legal-details'>
                    <p className='mb-1'><strong>Реквізити для оплати</strong></p>
                    <p className='mb-1'>Отримувач: {SHOP.bank.recipient}</p>
                    {SHOP.taxId && <p className='mb-1'>Код отримувача: {SHOP.taxId}</p>}
                    <p className='mb-1'>IBAN: {SHOP.bank.iban}</p>
                    {SHOP.bank.bankName && <p className='mb-1'>Банк: {SHOP.bank.bankName}</p>}
                    <p className='mb-1'>
                      Сума: {Number(order.totalPrice).toLocaleString('uk-UA')} грн
                    </p>
                    <p className='mb-0'>
                      Призначення платежу: Оплата замовлення {orderLabel(order)}
                    </p>
                  </div>
                ) : (
                  <p className='text-muted'>
                    Менеджер надішле вам реквізити для оплати.
                  </p>
                ))}
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

              {/* Кнопка адміна — підтвердити оплату (переказ або накладений платіж) */}
              {userInfo?.isAdmin && !order.isPaid && !order.isCancelled && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn w-100'
                    onClick={payOrderHandler}
                    disabled={loadingPay}
                  >
                    Позначити як оплачено
                  </Button>
                </ListGroup.Item>
              )}

              {/* Адмін — ТТН Нової Пошти після відправлення */}
              {userInfo?.isAdmin && !order.isCancelled && !order.isDelivered && (
                <ListGroup.Item>
                  <Form onSubmit={trackingHandler}>
                    <Form.Label className='small mb-1'>
                      {order.trackingNumber ? 'Змінити ТТН' : 'ТТН Нової Пошти'}
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder='20450000000000'
                        inputMode='numeric'
                        required
                      />
                      <Button type='submit' disabled={loadingTracking}>
                        Зберегти
                      </Button>
                    </InputGroup>
                  </Form>
                </ListGroup.Item>
              )}

              {/* Кнопка адміна — позначити як доставлено */}
              {userInfo?.isAdmin && !order.isDelivered && !order.isCancelled && (
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

              {/* Адмін — скасування з поверненням товару на склад */}
              {userInfo?.isAdmin && !order.isDelivered && !order.isCancelled && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    variant='outline-danger'
                    className='w-100'
                    onClick={cancelOrderHandler}
                    disabled={loadingCancel}
                  >
                    Скасувати замовлення
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
