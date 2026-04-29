import { Card, CardBody, CardText } from 'react-bootstrap'

export const Product = ( { Product }) => {
  return (
    <Card className='my-3 p-3 rounded h-90'>
      <a href={`/product/${Product._id}`}>
        <Card.Img
          src={Product.image}
          variant='top'
          style={{ height: '200px', objectFit: 'contain' }}
        />
      </a>

      <CardBody>
        <a href={`/product/${Product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{Product.name}</strong>
          </Card.Title>
        </a>
        <CardText as="h3">
          ${Product.price} грн.
        </CardText>
      </CardBody>
    </Card>
  )
}
