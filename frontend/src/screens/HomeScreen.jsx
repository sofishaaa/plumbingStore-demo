import { useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import FilterSidebar from '../components/FilterSidebar';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { keyword, pageNumber = 1 } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(keyword || '');

  // Зчитуємо фільтри з URL
  const filters = {
    category:  searchParams.get('category')  || '',
    brand:     searchParams.get('brand')     || '',
    minPrice:  searchParams.get('minPrice')  || '',
    maxPrice:  searchParams.get('maxPrice')  || '',
    minRating: searchParams.get('minRating') || '',
    inStock:   searchParams.get('inStock')   || '',
    pipeSize:  searchParams.get('pipeSize')  || '',
    sortBy:    searchParams.get('sortBy')    || '',
  };

  const hasFilters = Object.values(filters).some((v) => v !== '');

  const handleFilterChange = (newFilters) => {
    const params = {};
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) navigate(`/search/${q}`);
    else navigate('/');
  };

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    ...filters,
  });

  return (
    <>
      <Meta />

      {/* Пошуковий рядок */}
      <div className='home-search-bar'>
        <Form onSubmit={handleSearch}>
          <InputGroup>
            <Form.Control
              type='text'
              placeholder='Пошук за назвою, брендом, категорією...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='home-search-input'
            />
            {keyword && (
              <Button
                variant='outline-secondary'
                onClick={() => { setSearchInput(''); navigate('/'); }}
                title='Очистити'
              >
                <FaTimes />
              </Button>
            )}
            <Button type='submit' className='home-search-btn'>
              <FaSearch className='me-1' /> Знайти
            </Button>
          </InputGroup>
        </Form>
      </div>

      {/* Карусель тільки на головній без фільтрів */}
      {!keyword && !hasFilters && <ProductCarousel />}

      {/* Заголовок */}
      {keyword ? (
        <div className='search-header'>
          <Link to='/' className='btn btn-light btn-sm me-3'>← Назад</Link>
          <h1 className='d-inline'>Результати: «{keyword}»</h1>
        </div>
      ) : (
        <h1 className='section-title'>{hasFilters ? 'Товари за фільтрами' : 'Новинки'}</h1>
      )}

      <Row className='mt-3'>
        {/* Sidebar */}
        <Col md={3}>
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </Col>

        {/* Товари */}
        <Col md={9}>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : data.products.length === 0 ? (
            <Message>
              Товарів не знайдено.{' '}
              {(keyword || hasFilters) && (
                <Link to='/' onClick={() => setSearchParams({})}>
                  Скинути пошук та фільтри
                </Link>
              )}
            </Message>
          ) : (
            <>
              <p className='results-count'>
                Знайдено <strong>{data.products.length}</strong> товарів
                {data.pages > 1 && ` (сторінка ${data.page} з ${data.pages})`}
              </p>
              <Row>
                {data.products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4}>
                    <Product Product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword || ''}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen;
