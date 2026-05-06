import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useResetPasswordMutation } from '../slices/usersApiSlice';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Паролі не збігаються');
      return;
    }
    if (password.length < 6) {
      toast.error('Пароль має містити щонайменше 6 символів');
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Пароль успішно змінено!');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || 'Посилання недійсне або термін дії минув');
    }
  };

  return (
    <FormContainer>
      <h1>Новий пароль</h1>
      <p className='mt-2 mb-3' style={{ color: '#6b7280' }}>
        Введіть новий пароль для вашого акаунта.
      </p>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Новий пароль</Form.Label>
          <Form.Control
            type='password'
            placeholder='Мінімум 6 символів'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Підтвердіть пароль</Form.Label>
          <Form.Control
            type='password'
            placeholder='Повторіть пароль'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          disabled={isLoading}
          type='submit'
          variant='primary'
          className='mt-3 w-100'
        >
          Зберегти пароль
        </Button>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
