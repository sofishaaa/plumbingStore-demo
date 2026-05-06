import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';
import { useSelector } from 'react-redux';

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deleteHandler = async (id) => {
    if (window.confirm('Видалити користувача?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success('Користувача видалено');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>Користувачі</h1>

      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ім'я</th>
              <th>Email</th>
              <th>Адмін</th>
              <th>Дата реєстрації</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                </td>
                <td>
                  {/* Не можна редагувати/видаляти себе */}
                  {user._id !== userInfo._id && (
                    <>
                      <LinkContainer to={`/admin/user/${user._id}/edit`}>
                        <Button variant='light' className='btn-sm mx-2'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
