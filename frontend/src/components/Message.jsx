import { Alert } from 'react-bootstrap';

const Message = ({ variant = 'info', children }) => (
  <Alert variant={variant}>{children}</Alert>
);

export default Message;
