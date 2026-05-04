import { Card, CardBody, CardText } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating  from './Rating'

export const Product = ( { Product }) => {
  return (
    <Card className='my-3 p-3 rounded h-90'>
      <Link to={`/product/${Product._id}`}>
        <Card.Img
          src={Product.image}
          variant='top'
          style={{ height: '200px', objectFit: 'contain' }}
        />
      </Link>
      <CardBody>
        <Link to={`/product/${Product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{Product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating value={ Product.rating } text={`${Product.numReviews}
          відгуків`} />
        </Card.Text>

        <CardText as="h3">
          {Product.price} грн.
        </CardText>
      </CardBody>
    </Card>
  )
}
