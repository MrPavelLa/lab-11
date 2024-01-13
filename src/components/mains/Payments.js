import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const Payments = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [operationType, setOperationType] = useState('оплата');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [userAccounts, setUserAccounts] = useState([]);
  const [userCode, setUserCode] = useState('');
  const [Oname, setOname] = useState('');
  const usercode = useSelector((state) => state.code.usercode);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users`);
        const userData = await response.json();
        const user = userData.find(user => user.code === usercode);
        if (user) {
          setUserAccounts(user.accounts);
          setCardNumber(user.accounts[0]);
          setUserCode(user.code);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [usercode]);

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleOperationTypeChange = (e) => {
    setOperationType(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  const handleONameChange = (e) => {
    setOname(e.target.value);
  };

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const getCurrentDateAndTime = () => {
    const currentDate = new Date();
    const date = currentDate.toISOString().slice(0, 10);
    const time = currentDate.toLocaleTimeString().slice(0, 5);
    return { date, time };
  };


  const handleConfirm = async () => {
    const token = Cookies.get('jwt');
    try {
      const { date, time } = getCurrentDateAndTime();

      const newData = {
        code: userCode,
        operationName: Oname,
        date,
        time,
        amount: Number(amount),
        category: operationType,
        accounts: cardNumber,
        target: accountNumber,
        isdeleted: false
      };

      const response = await axios.post(`http://localhost:5001/transactions`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data;
      alert(`Новая запись: ${JSON.stringify(responseData)}`);

    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };
  
  if (!usercode || usercode.trim() === '') {
    return (
      <div className='TransactCont'>
        <p>У вас нет операций</p>
      </div>
    )
  }

  return (
    <div className='ReplenishmentCont'>
      <label htmlFor="cardNumber">Номер карты:</label>
      <select id="cardNumber" value={cardNumber} onChange={handleCardNumberChange}>
        {userAccounts.map(account => (
          <option key={account} value={account}>{account}</option>
        ))}
      </select>

      <label htmlFor="operationType">Тип операции:</label>
      <select id="operationType" value={operationType} onChange={handleOperationTypeChange}>
        <option value="оплата">Оплата</option>
        <option value="пополнение">Пополнение</option>
      </select>
      <label htmlFor="Oname">Наименование:</label>
      <input type="text" id="Oname" value={Oname} onChange={handleONameChange} />

      <label htmlFor="amount">Сумма:</label>
      <input type="text" id="amount" value={amount} onChange={handleAmountChange} />

      <label htmlFor="accountNumber">Номер счета:</label>
      <input type="text" id="accountNumber" value={accountNumber} onChange={handleAccountNumberChange} />

      <button onClick={handleConfirm}>Готово</button>
    </div>
  );
};

export default Payments;