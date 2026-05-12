import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const CATEGORIES = [
  'Рушникосушки',
  'Унітази',
  'Інсталяції та кнопки зливу',
  'Змішувачі',
  'Тумби',
  'Душові кабіни',
  'Душові набори',
  'Ванни',
  'Радіатори',
  'Аксесуари для ванної кімнати',
  'Водовідведення',
  'Тепла підлога',
  'Дзеркала',
  'Кухонні мийки',
  'Інше',
];

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();
      toast.success('Товар оновлено');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        ← Назад
      </Link>

      <FormContainer>
        <h1>Редагування товару</h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Назва товару</Form.Label>
              <Form.Control
                type='text'
                placeholder='Введіть назву'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='price' className='my-2'>
              <Form.Label>Ціна (грн)</Form.Label>
              <Form.Control
                type='number'
                min='0'
                placeholder='0'
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Зображення</Form.Label>
              <Form.Control
                type='text'
                placeholder='/images/назва.jpg'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control
                className='mt-2'
                type='file'
                label='Завантажити зображення'
                onChange={uploadFileHandler}
              />
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand' className='my-2'>
              <Form.Label>Бренд</Form.Label>
              <Form.Control
                type='text'
                placeholder='Наприклад: Grohe, Terma, Hansgrohe'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='category' className='my-2'>
              <Form.Label>Категорія</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value=''>Оберіть категорію...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='countInStock' className='my-2'>
              <Form.Label>Кількість в наявності</Form.Label>
              <Form.Control
                type='number'
                min='0'
                placeholder='0'
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Group controlId='description' className='my-2'>
              <Form.Label>Опис</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                placeholder='Детальний опис товару...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              className='mt-3 w-100'
              disabled={loadingUpdate}
            >
              Зберегти зміни
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
