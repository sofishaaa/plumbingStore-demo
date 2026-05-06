import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [novaPoshtaBranch, setNovaPoshtaBranch] = useState(
    shippingAddress?.novaPoshtaBranch || ''
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ address, city, postalCode, novaPoshtaBranch, country: 'Україна' })
    );
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Адреса доставки</h1>
      <p className='text-muted'>
        🚚 Доставка Новою Поштою. Вартість розраховується менеджером після підтвердження замовлення.
      </p>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='city'>
          <Form.Label>Місто</Form.Label>
          <Form.Control
            type='text'
            placeholder='Наприклад: Львів'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='novaPoshtaBranch'>
          <Form.Label>Відділення Нової Пошти</Form.Label>
          <Form.Control
            type='text'
            placeholder='Наприклад: №5 або Поштомат №1234'
            value={novaPoshtaBranch}
            onChange={(e) => setNovaPoshtaBranch(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Адреса (якщо доставка кур'єром)</Form.Label>
          <Form.Control
            type='text'
            placeholder='Вулиця, будинок, квартира'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Поштовий індекс</Form.Label>
          <Form.Control
            type='text'
            placeholder='79000'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3 w-100'>
          Далі
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
