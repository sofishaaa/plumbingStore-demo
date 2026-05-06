import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setSent(true);
    } catch (err) {
      toast.error(err?.data?.message || 'Помилка. Спробуйте ще раз.');
    }
  };

  if (sent) {
    return (
      <FormContainer>
        <h1>Перевірте пошту</h1>
        <p className='mt-3' style={{ color: '#373D43' }}>
          Якщо акаунт з адресою <strong>{email}</strong> існує — ми надіслали
          посилання для скидання пароля. Перевірте папку «Спам», якщо лист не
          з'явився протягом кількох хвилин.
        </p>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <h1>Забули пароль?</h1>
      <p className='mt-2 mb-3' style={{ color: '#6b7280' }}>
        Введіть email, вказаний при реєстрації — надішлемо посилання для
        скидання пароля.
      </p>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Введіть ваш email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          disabled={isLoading}
          type='submit'
          variant='primary'
          className='mt-3 w-100'
        >
          Надіслати посилання
        </Button>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
