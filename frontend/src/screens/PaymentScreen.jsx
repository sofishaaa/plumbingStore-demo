import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('Оплата при отриманні');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shippingAddress?.city) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Спосіб оплати</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend' className='mb-3'>
            Оберіть спосіб оплати
          </Form.Label>
          <Col>
            <Form.Check
              className='mb-2'
              type='radio'
              label='Оплата при отриманні (накладений платіж НП)'
              id='CashOnDelivery'
              name='paymentMethod'
              value='Оплата при отриманні'
              checked={paymentMethod === 'Оплата при отриманні'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              className='mb-2'
              type='radio'
              label='Банківський переказ (за реквізитами)'
              id='BankTransfer'
              name='paymentMethod'
              value='Банківський переказ'
              checked={paymentMethod === 'Банківський переказ'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

          </Col>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-4 w-100'>
          Далі
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
