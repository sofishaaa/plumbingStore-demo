import { Row, Col } from 'react-bootstrap'
import products from '../products'
import { Product } from '../components/Product'

export const HomeScreen = () => {
  return (
    <>
      <h1>Новинки</h1>
      <Row>
        {products.map((product) => (
          <Col key={products._id} sm={12} md={6} lg={4} xl={3}>
              <Product Product={product} /> 
          </Col>
        ))}
      </Row>
    </>
  )
}
