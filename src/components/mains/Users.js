
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


function Users() {
  const [users, setUsers] = useState([]);
  const [userCode, setUserCode] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [userAccounts, setUserAccounts] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('jwt');

      const [usersResponse, verificationsResponse] = await Promise.all([
        axios.get('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:5003/verification', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const usersData = usersResponse.data;
      const verificationsData = verificationsResponse.data;

      const mergedData = usersData.map(user => {
        const verification = verificationsData.find(v => v.code === user.code);
        return { ...user, ...verification };
      });

      setUsers(mergedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const addUsers = async () => {
    try {
      const token = Cookies.get('jwt');

      const userResponse = await axios.post('http://localhost:5000/users', {
        code: userCode,
        firstName: userFirstName,
        lastName: userLastName,
        photo: userPhoto,
        accounts: userAccounts.split(',').map((account) => account.trim()),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.post('http://localhost:5003/verification', {
        code: userCode,
        login: userLogin,
        password: userPassword,
        role: userRole,
        phonenumber: userPhoneNumber,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserFirstName('');
      setUserLastName('');
      setUserPhoto('');
      setUserAccounts('');
      setUserCode('');
      setUserPassword('');
      setUserLogin('');
      setUserRole('user');
      setUserPhoneNumber('');

      fetchData();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };


  const deleteUser = async (code) => {
    const token = Cookies.get('jwt');
    try {
      await axios.delete(`http://localhost:5000/users/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await axios.delete(`http://localhost:5003/verification/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <div className='addUser'>
        <input
          type="text"
          placeholder="Имя"
          value={userFirstName}
          onChange={(e) => setUserFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Код"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={userLastName}
          onChange={(e) => setUserLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Пароль"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Url фото"
          value={userPhoto}
          onChange={(e) => setUserPhoto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Счета(массив)"
          value={userAccounts}
          onChange={(e) => setUserAccounts(e.target.value)}
        />
        <input
          type="text"
          placeholder="Логин"
          value={userLogin}
          onChange={(e) => setUserLogin(e.target.value)}
        />

        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </select>

        <input
          type="text"
          placeholder="Номер телефона"
          value={userPhoneNumber}
          onChange={(e) => setUserPhoneNumber(e.target.value)}
          maxLength="13"
        />

        <button onClick={addUsers}>Добавить</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Password</th>
            <th>Photo</th>
            <th>Accounts</th>
            <th>Login</th>
            <th>Role</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.code}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.password}</td>
              <td>{user.photo}</td>
              <td>{user.accounts.join(', ')}</td>
              <td>{user.login}</td>
              <td>{user.role}</td>
              <td>{user.phonenumber}</td>
              <td>
                <button onClick={() => deleteUser(user.code)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Users;


