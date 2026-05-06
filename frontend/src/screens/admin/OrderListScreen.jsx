import { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTimes, FaCheck, FaTruck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetOrdersQuery,
  useSetShippingPriceMutation,
} from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [setShippingPrice, { isLoading: loadingShipping }] =
    useSetShippingPriceMutation();

  // Модальне вікно для встановлення доставки
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [shippingPrice, setShippingPriceValue] = useState('');
  const [managerNote, setManagerNote] = useState('');

  const openShippingModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShippingPriceValue('');
    setManagerNote('');
    setShowModal(true);
  };

  const confirmShippingHandler = async () => {
    if (!shippingPrice || Number(shippingPrice) < 0) {
      toast.error('Введіть коректну вартість доставки');
      return;
    }
    try {
      await setShippingPrice({
        orderId: selectedOrderId,
        shippingPrice: Number(shippingPrice),
        managerNote,
      }).unwrap();
      refetch();
      toast.success('Вартість доставки встановлено');
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <h1>Замовлення</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клієнт</th>
              <th>Дата</th>
              <th>Товари</th>
              <th>Доставка НП</th>
              <th>Разом</th>
              <th>Оплата</th>
              <th>Доставка</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                </td>
                <td>
                  {Number(order.itemsPrice).toLocaleString('uk-UA')} грн
                </td>
                <td>
                  {order.shippingConfirmed ? (
                    <span className='text-success'>
                      {Number(order.shippingPrice).toLocaleString('uk-UA')} грн
                    </span>
                  ) : (
                    <Button
                      variant='outline-warning'
                      size='sm'
                      onClick={() => openShippingModal(order._id)}
                    >
                      <FaTruck /> Вказати
                    </Button>
                  )}
                </td>
                <td>
                  {Number(order.totalPrice).toLocaleString('uk-UA')} грн
                </td>
                <td>
                  {order.isPaid ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' size='sm'>
                      Деталі
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Модальне вікно — вартість доставки НП */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>🚚 Вартість доставки Новою Поштою</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3'>
            <Form.Label>Вартість доставки (грн)</Form.Label>
            <Form.Control
              type='number'
              min='0'
              placeholder='Наприклад: 185'
              value={shippingPrice}
              onChange={(e) => setShippingPriceValue(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Нотатка для клієнта (необов'язково)</Form.Label>
            <Form.Control
              type='text'
              placeholder='Наприклад: НП відділення №5, Львів'
              value={managerNote}
              onChange={(e) => setManagerNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Скасувати
          </Button>
          <Button
            variant='primary'
            onClick={confirmShippingHandler}
            disabled={loadingShipping}
          >
            Підтвердити
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderListScreen;
