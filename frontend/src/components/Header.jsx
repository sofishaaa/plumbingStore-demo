import { Navbar, Nav, Container } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import logo from '../assets/logo.png'

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect> 
        <Container>
          <LinkContainer to='/'>
          <Navbar.Brand href="/">
            <img src={logo} alt='Сантех Студія' height='80' />
              Сантех Студія
          </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to='/cart'>
              <Nav.Link>
                <FaShoppingCart /> Кошик
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/login'>
               <Nav.Link>
                <FaUser /> Увійти
               </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
export default Header