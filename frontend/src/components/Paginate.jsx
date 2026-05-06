import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSearchParams } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  const [searchParams] = useSearchParams();

  const buildUrl = (pageNum) => {
    if (isAdmin) return `/admin/productlist/${pageNum}`;
    const base = keyword
      ? `/search/${keyword}/page/${pageNum}`
      : `/page/${pageNum}`;
    const qs = searchParams.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    pages > 1 && (
      <Pagination className='justify-content-center mt-3'>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={buildUrl(x + 1)}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
