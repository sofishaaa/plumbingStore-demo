import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { getSafeRedirect } from '../utils/safeRedirect';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { MIN_PASSWORD_LENGTH } from '../constants';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = getSafeRedirect(sp.get('redirect'));

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Паролі не співпадають');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Пароль має містити щонайменше ${MIN_PASSWORD_LENGTH} символів`);
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Реєстрація</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Ім'я</Form.Label>
          <Form.Control
            type='text'
            placeholder="Введіть ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Введіть email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type='password'
            placeholder={`Мінімум ${MIN_PASSWORD_LENGTH} символів`}
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete='new-password'
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

        <p className='consent-note mt-3'>
          Реєструючись, ви погоджуєтесь з <Link to='/terms'>Публічною офертою</Link>{' '}
          та надаєте згоду на обробку персональних даних відповідно до{' '}
          <Link to='/privacy'>Політики конфіденційності</Link>.
        </p>

        <Button
          disabled={isLoading}
          type='submit'
          variant='primary'
          className='mt-2 w-100'
        >
          Зареєструватись
        </Button>
        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Вже є акаунт?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Увійти
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
