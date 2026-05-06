import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => (
  <Nav className='justify-content-center mb-4'>
    <Nav.Item>
      {step1 ? (
        <LinkContainer to='/login'>
          <Nav.Link>Вхід</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>Вхід</Nav.Link>
      )}
    </Nav.Item>

    <Nav.Item>
      {step2 ? (
        <LinkContainer to='/shipping'>
          <Nav.Link>Доставка</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>Доставка</Nav.Link>
      )}
    </Nav.Item>

    <Nav.Item>
      {step3 ? (
        <LinkContainer to='/payment'>
          <Nav.Link>Оплата</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>Оплата</Nav.Link>
      )}
    </Nav.Item>

    <Nav.Item>
      {step4 ? (
        <LinkContainer to='/placeorder'>
          <Nav.Link>Підтвердження</Nav.Link>
        </LinkContainer>
      ) : (
        <Nav.Link disabled>Підтвердження</Nav.Link>
      )}
    </Nav.Item>
  </Nav>
);

export default CheckoutSteps;
