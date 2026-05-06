import { useState } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { useGetFilterOptionsQuery } from '../slices/productsApiSlice';

const PIPE_SIZES = ['G1/2', 'G3/4', 'G1', 'DN15', 'DN20', 'DN25', 'DN32', 'DN40', 'DN50', 'DN110'];

const FilterSidebar = ({ filters, onChange }) => {
  const { data: options } = useGetFilterOptionsQuery();
  const [localPriceMin, setLocalPriceMin] = useState(filters.minPrice || '');
  const [localPriceMax, setLocalPriceMax] = useState(filters.maxPrice || '');
  const [open, setOpen] = useState(false);

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => v && k !== 'sortBy'
  );

  const set = (key, value) => onChange({ ...filters, [key]: value });

  const applyPrice = () => {
    onChange({ ...filters, minPrice: localPriceMin, maxPrice: localPriceMax });
  };

  const clearAll = () => {
    setLocalPriceMin('');
    setLocalPriceMax('');
    onChange({});
  };

  const body = (
    <div className='filter-body'>
      {/* Сортування */}
      <div className='filter-section'>
        <p className='filter-label'>Сортування</p>
        <Form.Select
          size='sm'
          value={filters.sortBy || ''}
          onChange={(e) => set('sortBy', e.target.value)}
          className='filter-select'
        >
          <option value=''>Новинки</option>
          <option value='price-asc'>Ціна: від низької</option>
          <option value='price-desc'>Ціна: від високої</option>
          <option value='rating'>Найвищий рейтинг</option>
        </Form.Select>
      </div>

      {/* Категорія */}
      <Accordion flush>
        <Accordion.Item eventKey='category' className='filter-accordion-item'>
          <Accordion.Header>Категорія</Accordion.Header>
          <Accordion.Body className='filter-accordion-body'>
            {(options?.categories || []).map((cat) => (
              <Form.Check
                key={cat}
                type='radio'
                id={`cat-${cat}`}
                label={cat}
                name='category'
                checked={filters.category === cat}
                onChange={() =>
                  set('category', filters.category === cat ? '' : cat)
                }
                className='filter-radio'
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Бренд */}
        <Accordion.Item eventKey='brand' className='filter-accordion-item'>
          <Accordion.Header>Бренд</Accordion.Header>
          <Accordion.Body className='filter-accordion-body'>
            {(options?.brands || []).map((b) => (
              <Form.Check
                key={b}
                type='radio'
                id={`brand-${b}`}
                label={b}
                name='brand'
                checked={filters.brand === b}
                onChange={() => set('brand', filters.brand === b ? '' : b)}
                className='filter-radio'
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Ціна */}
        <Accordion.Item eventKey='price' className='filter-accordion-item'>
          <Accordion.Header>Ціна (грн)</Accordion.Header>
          <Accordion.Body className='filter-accordion-body'>
            <div className='price-inputs'>
              <Form.Control
                type='number'
                placeholder='Від'
                size='sm'
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(e.target.value)}
                min={0}
              />
              <span className='price-dash'>—</span>
              <Form.Control
                type='number'
                placeholder='До'
                size='sm'
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(e.target.value)}
                min={0}
              />
            </div>
            <Button
              size='sm'
              className='apply-price-btn mt-2'
              onClick={applyPrice}
            >
              Застосувати
            </Button>
          </Accordion.Body>
        </Accordion.Item>

        {/* Рейтинг */}
        <Accordion.Item eventKey='rating' className='filter-accordion-item'>
          <Accordion.Header>Рейтинг</Accordion.Header>
          <Accordion.Body className='filter-accordion-body'>
            {[5, 4, 3, 2, 1].map((r) => (
              <Form.Check
                key={r}
                type='radio'
                id={`rating-${r}`}
                name='minRating'
                checked={filters.minRating === String(r)}
                onChange={() =>
                  set('minRating', filters.minRating === String(r) ? '' : String(r))
                }
                label={
                  <span className='rating-filter-label'>
                    {'★'.repeat(r)}{'☆'.repeat(5 - r)} і вище
                  </span>
                }
                className='filter-radio'
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Розмір підключення */}
        <Accordion.Item eventKey='pipeSize' className='filter-accordion-item'>
          <Accordion.Header>Розмір підключення</Accordion.Header>
          <Accordion.Body className='filter-accordion-body'>
            <p className='filter-hint'>Для змішувачів, інсталяцій та трубопроводу</p>
            <div className='pipe-size-grid'>
              {PIPE_SIZES.map((size) => (
                <button
                  key={size}
                  className={`pipe-size-btn${filters.pipeSize === size ? ' active' : ''}`}
                  onClick={() => set('pipeSize', filters.pipeSize === size ? '' : size)}
                  type='button'
                >
                  {size}
                </button>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Наявність */}
        <Accordion.Item eventKey='stock' className='filter-accordion-item'>
          <Accordion.Header>Наявність</Accordion.Header>
          <Accordion.Body className='filter-accordion-body'>
            <Form.Check
              type='switch'
              id='inStock'
              label='Тільки в наявності'
              checked={filters.inStock === 'true'}
              onChange={(e) => set('inStock', e.target.checked ? 'true' : '')}
              className='filter-switch'
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Скинути фільтри */}
      {hasActiveFilters && (
        <Button variant='outline-danger' size='sm' className='clear-filters-btn' onClick={clearAll}>
          <FaTimes className='me-1' /> Скинути фільтри
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className='filter-sidebar d-none d-md-block'>
        <div className='filter-header'>
          <FaFilter className='me-2' />
          <span>Фільтри</span>
          {hasActiveFilters && (
            <span className='filter-active-badge'>{
              Object.values(filters).filter(v => v && v !== filters.sortBy).length
            }</span>
          )}
        </div>
        {body}
      </div>

      {/* Mobile toggle */}
      <div className='d-md-none mb-3'>
        <Button
          variant={hasActiveFilters ? 'warning' : 'outline-secondary'}
          size='sm'
          onClick={() => setOpen(!open)}
          className='mobile-filter-toggle'
        >
          <FaFilter className='me-2' />
          Фільтри {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
        </Button>
        {open && (
          <div className='filter-sidebar mobile mt-2'>
            {body}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterSidebar;
