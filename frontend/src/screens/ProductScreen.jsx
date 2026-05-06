import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Image, ListGroup, Card, Button, Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success('Відгук додано!');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        ← Назад
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            {/* Зображення */}
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            {/* Інформація */}
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} відгуків`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Бренд:</strong> {product.brand}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Категорія:</strong> {product.category}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Ціна:</strong>{' '}
                  {product.price.toLocaleString('uk-UA')} грн
                </ListGroup.Item>
                <ListGroup.Item>{product.description}</ListGroup.Item>
              </ListGroup>
            </Col>

            {/* Кошик */}
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Ціна:</Col>
                      <Col>
                        <strong>
                          {product.price.toLocaleString('uk-UA')} грн
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Статус:</Col>
                      <Col>
                        {product.countInStock > 0
                          ? 'В наявності'
                          : 'Немає в наявності'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Кількість:</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className='btn-block w-100'
                      type='button'
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Додати в кошик
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Відгуки */}
          <Row className='review mt-4'>
            <Col md={6}>
              <h2>Відгуки</h2>

              {product.reviews.length === 0 && (
                <Message>Відгуків поки немає</Message>
              )}

              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{new Date(review.createdAt).toLocaleDateString('uk-UA')}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2>Написати відгук</h2>
                  {loadingReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group controlId='rating' className='my-2'>
                        <Form.Label>Оцінка</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value=''>Оберіть...</option>
                          <option value='1'>1 — Погано</option>
                          <option value='2'>2 — Задовільно</option>
                          <option value='3'>3 — Добре</option>
                          <option value='4'>4 — Дуже добре</option>
                          <option value='5'>5 — Відмінно</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment' className='my-2'>
                        <Form.Label>Коментар</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        Надіслати відгук
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      <Link to='/login'>Увійдіть</Link>, щоб залишити відгук
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
