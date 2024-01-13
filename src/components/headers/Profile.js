import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveCode, clearCode } from '../../store/actions/action1';
import { saveRole, clearRole } from '../../store/actions/action2';
import Modal from '../mains/Modal3';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = ({ closeProfile }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const usercode = useSelector((state) => state.code.usercode);

  const handleAuthorize = async () => {
    try {
      const response = await axios.post('http://localhost:5003/login', { login, password });
      const { role, code, token } = response.data;

      Cookies.set('jwt', token);
      dispatch(saveCode(code));
      dispatch(saveRole(role));
      setIsAuthenticated(true);
      console.log('Role:', role);
      console.log('Code:', code);
      console.log('Token:', token);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    const token = Cookies.get('jwt');
    try {
      const response = await axios.get(`http://localhost:5000/users/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('jwt');
    dispatch(clearCode());
    dispatch(clearRole());
    setIsAuthenticated(false);
    setUserData(null);
  };

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  return (
    <div className="profile-dropdown">
      {userData ? (
        <div className="user-info">
          <p>Добро пожаловать</p>
          <p>{userData.firstName} {userData.lastName}</p>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      ) : (
        <div className="login-form">
          <p>Введите Ваш логин:</p>
          <input type="text" placeholder="Login" value={login} onChange={(e) => setLogin(e.target.value)} />
          <p>Введите Ваш пароль:</p>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleAuthorize}>Войти</button>
          <Modal />
        </div>
      )}
      <button onClick={closeProfile}>Close</button>
    </div>
  );
};

export default Profile;
