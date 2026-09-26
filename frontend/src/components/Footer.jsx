import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
} from 'react-icons/fa';
import SHOP from '../config/shop';

const CATALOG_LINKS = [
  ['Рушникосушки', 'Рушникосушки'],
  ['Змішувачі', 'Змішувачі'],
  ['Унітази', 'Унітази'],
  ['Ванни', 'Ванни'],
  ['Душові набори', 'Душові набори'],
  ['Душові кабіни', 'Душові кабіни'],
  ['Аксесуари для ванної кімнати', 'Аксесуари для ванної'],
  ['Водовідведення', 'Водовідведення'],
  ['Тепла підлога', 'Тепла підлога'],
  ['Дзеркала', 'Дзеркала'],
  ['Кухонні мийки', 'Кухонні мийки'],
];

const categoryUrl = (category) =>
  `/?${new URLSearchParams({ category }).toString()}`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='site-footer'>
      <Container>
        <Row className='py-4 g-4'>
          {/* Бренд */}
          <Col lg={3} md={6}>
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

          {/* Навігація — точний фільтр за категорією, а не текстовий пошук */}
          <Col lg={3} md={6}>
            <h5 className='footer-title'>Каталог</h5>
            <ul className='footer-links'>
              {CATALOG_LINKS.map(([category, label]) => (
                <li key={category}>
                  <Link to={categoryUrl(category)}>{label}</Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Інформація для покупців */}
          <Col lg={3} md={6}>
            <h5 className='footer-title'>Покупцям</h5>
            <ul className='footer-links'>
              <li><Link to='/delivery-payment'>Оплата і доставка</Link></li>
              <li><Link to='/returns'>Обмін і повернення</Link></li>
              <li><Link to='/terms'>Публічна оферта</Link></li>
              <li><Link to='/privacy'>Політика конфіденційності</Link></li>
            </ul>
          </Col>

          {/* Контакти */}
          <Col lg={3} md={6}>
            <h5 className='footer-title'>Контакти</h5>
            <ul className='footer-contacts'>
              <li>
                <FaMapMarkerAlt className='footer-icon' />
                <a href={SHOP.mapUrl} target='_blank' rel='noopener noreferrer'>
                  {SHOP.address}
                </a>
              </li>
              <li>
                <FaPhone className='footer-icon' />
                <a href={`tel:${SHOP.phoneHref}`}>{SHOP.phone}</a>
              </li>
              {SHOP.email && (
                <li>
                  <FaEnvelope className='footer-icon' />
                  <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
                </li>
              )}
              {SHOP.workingHours && (
                <li>
                  <FaClock className='footer-icon' />
                  <span>{SHOP.workingHours}</span>
                </li>
              )}
            </ul>

            <a
              href={SHOP.mapUrl}
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
            {SHOP.legalName && (
              <p className='footer-legal'>
                {SHOP.legalName}
                {SHOP.taxId && `, код ${SHOP.taxId}`}
                {SHOP.legalAddress && `, ${SHOP.legalAddress}`}
              </p>
            )}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
