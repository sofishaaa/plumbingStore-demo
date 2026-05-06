import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='site-footer'>
      <Container>
        <Row className='py-4 g-4'>
          {/* Бренд */}
          <Col md={4}>
            <h5 className='footer-title'>Сантех Студія</h5>
            <p className='footer-text'>
              Інтернет-магазин сантехніки та обладнання для ванної кімнати.
              Якісні товари від провідних виробників.
            </p>
          </Col>

          {/* Навігація */}
          <Col md={4}>
            <h5 className='footer-title'>Каталог</h5>
            <ul className='footer-links'>
              <li><a href='/search/Рушникосушки'>Рушникосушки</a></li>
              <li><a href='/search/Змішувачі'>Змішувачі</a></li>
              <li><a href='/search/Унітази'>Унітази</a></li>
              <li><a href='/search/Ванни'>Ванни</a></li>
            </ul>
          </Col>

          {/* Контакти */}
          <Col md={4}>
            <h5 className='footer-title'>Контакти</h5>
            <ul className='footer-contacts'>
              <li>
                <FaMapMarkerAlt className='footer-icon' />
                <a
                  href='https://maps.app.goo.gl/SzXuYMQzzZmH7tqz7'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Львів, вул. Городоцька, 222
                </a>
              </li>
              <li>
                <FaPhone className='footer-icon' />
                <a href='tel:+380981234567'>+38 (098) 123-45-67</a>
              </li>
              <li>
                <FaEnvelope className='footer-icon' />
                <a href='mailto:info@santexstudio.ua'>info@santexstudio.ua</a>
              </li>
            </ul>

            <a
              href='https://maps.app.goo.gl/SzXuYMQzzZmH7tqz7'
              target='_blank'
              rel='noopener noreferrer'
              className='footer-map-btn'
            >
              Відкрити на картах →
            </a>
          </Col>
        </Row>

        <Row>
          <Col className='footer-bottom text-center py-3'>
            <p>Сантех Студія &copy; {currentYear}. Усі права захищені.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
