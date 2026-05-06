import { useParams } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const { pageNumber = 1 } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Створити новий товар?')) {
      try {
        await createProduct().unwrap();
        refetch();
        toast.success('Товар створено — заповніть дані');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Видалити товар? Цю дію не можна скасувати.')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
        toast.success('Товар видалено');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Товари</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createProductHandler}>
            <FaPlus /> Додати товар
          </Button>
        </Col>
      </Row>

      {(loadingCreate || loadingDelete) && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Ціна</th>
                <th>Категорія</th>
                <th>Бренд</th>
                <th>Залишок</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>
                    {product.price.toLocaleString('uk-UA')} грн
                  </td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <span
                      className={
                        product.countInStock === 0 ? 'text-danger' : ''
                      }
                    >
                      {product.countInStock}
                    </span>
                  </td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={true}
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
