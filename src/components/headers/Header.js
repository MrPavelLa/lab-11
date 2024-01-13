import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Profile from './Profile';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const Header = () => {
  const [selectedCategory, setSelectedCategory] = useState('Deposits');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);
  const navigate = useNavigate();

  const categories = {
    Deposits: ['Мои вклады', 'Расчетные', 'Накопительные', 'Валютные'],
    Loans: ['Мои кредиты', 'Ипотечные', 'Потребительские', 'Автокредиты'],
    Transaction: ['История операций', 'Изменить', 'Операции', 'Отчет'],
  };

  const admincategories = {
    Deposits: ['все вклады', 'заявки на вклады'],
    Loans: ['все кредиты', 'заявки на кредиты'],
    Transaction: ['История операций', 'Изменить', 'Отчет'],
    Users: [''],
  };

  useEffect(() => {
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
    navigate('/Deposits');
    setSelectedCategory('Deposits');
    handleBarClick('Deposits');
    fetchData();
  }, [usercode]);

  useEffect(() => {
    setUserData(null);
  }, [usercode]);


  const handleBarClick = (category) => {
    setSelectedCategory(category);
  };

  const openProfile = () => {
    setIsProfileOpen(true);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <>
      <div className='header_link'>
        <div className='Bank_Name_logo'>
          <img src="/BankLogo.png" alt="BankLogo" className="BankLogo" />
          <a className="BankName">ПРОГРЕСС БАНК</a>
        </div>

        <button className="Profile" onClick={openProfile}>
          {userData ? (
            <img src={userData.photo ? `/${userData.photo}` : '/NoProfile.jpg'} alt="Profile" className="ProfilePhoto" />

          ) : (
            <img src="/NoProfile.jpg" alt="NoProfile" className="NoProfile" />
          )}
        </button>
      </div>

      <div className="link-container">
        <button className='link' onClick={() => handleBarClick('Deposits')}>
          <Link to="/Deposits">Вклады</Link>
          {selectedCategory === 'Deposits' && <div className='ButBor'></div>}
        </button>
        <button className='link' onClick={() => handleBarClick('Loans')}>
          <Link to="/Loans">Кредиты</Link>
          {selectedCategory === 'Loans' && <div className='ButBor'></div>}
        </button>
        <button className='link' onClick={() => handleBarClick('Transaction')}>
          <Link to="/Transaction">Операции</Link>
          {selectedCategory === 'Transaction' && <div className='ButBor'></div>}
        </button>
        {userrole === 'admin' && (
          <button className='link' onClick={() => handleBarClick('Users')}>
            <Link to="/Users">Пользователи</Link>
            {selectedCategory === 'Users' && <div className='ButBor'></div>}
          </button>
        )}
      </div>

      <div className="button-container">
        {(userrole === 'admin' ? admincategories : categories)[selectedCategory].map((text, index) => (
          text === 'История операций' ? (
            <Link key={index} className="bar-but" to="/Transaction">
              {text}
            </Link>
          ) : text === 'Операции' ? (
            <Link key={index} className="bar-but" to="/Payments">
              {text}
            </Link>
          ) : text === 'Изменить' ? (
            <Link key={index} className="bar-but" to="/Replenishment">
              {text}
            </Link>
          ) : text === 'Отчет' ? (
            <Link key={index} className="bar-but" to="/Poluch">
              {text}
            </Link>
          ) : (
            <a key={index} className="bar-but" href={`#${text}`}>
              {text}
            </a>
          )
        ))}
      </div>

      {isProfileOpen && (
        <Profile
          closeProfile={closeProfile}
        />
      )}
      <Outlet />
    </>
  );
};

export default Header;




