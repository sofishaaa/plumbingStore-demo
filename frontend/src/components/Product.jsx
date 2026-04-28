import { Card, CardBody, CardText } from 'react-bootstrap'

export const Product = ( { Product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <a href={`/product/${Product._id}`}>  
        <Card.Img src={Product.image} variant='top' />
        </a>

      <CardBody>
        <a href={`/product/${Product._id}`}>
          <Card.Title as='div'>
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
