import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

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
            <div className='footer-socials'>
              <a
                href='https://www.instagram.com/santekh_studia?igsh=MTNhYnU5anNpeGp6NQ=='
                target='_blank'
                rel='noopener noreferrer'
                className='footer-social-btn'
                aria-label='Instagram'
              >
                <FaInstagram />
              </a>
              <a
                href='https://www.facebook.com/share/1NuuuUnTRC/?mibextid=wwXIfr'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-social-btn'
                aria-label='Facebook'
              >
                <FaFacebookF />
              </a>
              <a
                href='https://www.tiktok.com/@santekh.studiia?_r=1&_t=ZS-96IYqiEdBNk'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-social-btn'
                aria-label='TikTok'
              >
                <FaTiktok />
              </a>
            </div>
          </Col>

          {/* Навігація */}
          <Col md={4}>
            <h5 className='footer-title'>Каталог</h5>
            <ul className='footer-links'>
              <li><a href='/search/Рушникосушки'>Рушникосушки</a></li>
              <li><a href='/search/Змішувачі'>Змішувачі</a></li>
              <li><a href='/search/Унітази'>Унітази</a></li>
              <li><a href='/search/Ванни'>Ванни</a></li>
              <li><a href='/search/Душові набори'>Душові набори</a></li>
              <li><a href='/search/Душові кабіни'>Душові кабіни</a></li>
              <li><a href='/search/Аксесуари для ванної кімнати'>Аксесуари для ванної</a></li>
              <li><a href='/search/Водовідведення'>Водовідведення</a></li>
              <li><a href='/search/Тепла підлога'>Тепла підлога</a></li>
              <li><a href='/search/Дзеркала'>Дзеркала</a></li>
              <li><a href='/search/Кухонні мийки'>Кухонні мийки</a></li>
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
                  м.Львів, вул.Городоцька 226а (ЖК Resident Hall)
                </a>
              </li>
              <li>
                <FaPhone className='footer-icon' />
                <a href='tel:+380678029439'>+38 (067) 802-94-39</a>
              </li>
            </ul>

            <a
              href='https://maps.app.goo.gl/SzXuYMQzzZmH7tqz7'
              target='_blank'
              rel='noopener noreferrer'
              className='footer-map-btn'
            >
              Відкрити у картах →
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
