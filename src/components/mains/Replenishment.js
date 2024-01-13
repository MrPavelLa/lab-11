import React, { useState, useEffect } from 'react';
import Modal2 from './Modal2';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const Replenishment = () => {
  const [transactions, setTransactions] = useState([]);
  const [admincode, setAdmincode] = useState('');
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);

  const fetchData = async (usercode) => {
    try {
      const token = Cookies.get('jwt');
      const response = await axios.get(`http://localhost:5001/transactions/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userTransactions = response.data || [];
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Ошибка при получении данных транзакций:', error);
    }
  };

  useEffect(() => {
    fetchData(usercode);
  }, [usercode]);

  const handleUpdateTransactions = async () => {
    try {
      const token = Cookies.get('jwt');
      const response = await axios.get(`http://localhost:5001/transactions/${usercode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userTransactions = response.data || [];
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Ошибка при получении данных транзакций:', error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const currentDate = new Date();
      const transactionTime = new Date(transactions[index].date + ' ' + transactions[index].time);
      const difference = (currentDate - transactionTime) / (1000 * 60);
      const token = Cookies.get('jwt');

      if (difference <= 5) {
        await axios.delete(`http://localhost:5001/transactions/${transactions[index]._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      } else if (userrole === 'admin') {
        await axios.delete(`http://localhost:5001/transactions/${transactions[index]._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


      } else {
        alert('Время больше 5 минут. Удалить нельзя');
      }
      if (userrole === 'admin') {
        fetchAdminData();
      }
      else {
        handleUpdateTransactions();
      }
    } catch (error) {
      console.error('Ошибка удаления транзакции:', error);
    }
  };

  const handleRecover = async (index) => {
    try {
      const token = Cookies.get('jwt');

      await axios.put(
        `http://localhost:5001/transactions/recover/${transactions[index]._id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAdminData();
    } catch (error) {
      console.error('Ошибка восстановления транзакции:', error);
    }
  };

  const handleSearch = () => {
    fetchAdminData();
  };

  const fetchAdminData = async () => {
    try {
      const token = Cookies.get('jwt');
      const response = await axios.get(`http://localhost:5001/transactions/${admincode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userTransactions = response.data || [];
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Ошибка при получении данных транзакций:', error);
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
      <h1>Изменение платежей</h1>
      {userrole === 'admin' && (
        <div className='adm'>
          <input
            type="text"
            placeholder="Введите код"
            value={admincode}
            onChange={(e) => setAdmincode(e.target.value)}
          />
          <button onClick={handleSearch}>Поиск</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Наименование операции</th>
            <th>Дата</th>
            <th>Время</th>
            <th>Сумма</th>
            <th>Изменение</th>
            <th>Удаление</th>
            {userrole === 'admin' && (
              <th>Восстановить</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} style={{ backgroundColor: transaction.isdeleted ? 'lightgrey' : 'white' }}>
              <td>{transaction.operationName}</td>
              <td>{transaction.date}</td>
              <td>{transaction.time}</td>
              <td>{transaction.amount}</td>
              <td>
                {!transaction.isdeleted ? (
                  <Modal2
                    operationName={transaction.operationName}
                    id={transaction._id}
                    accounts={transaction.accounts}
                    target={transaction.target}
                    amount={transaction.amount}
                    onTransactionUpdate={handleUpdateTransactions}
                  />
                ) : (
                  <p>Отменена</p>
                )}
              </td>
              <td>
                {!transaction.isdeleted ? (
                  <button onClick={() => handleDelete(index)}>Удалить</button>
                ) : (
                  <p>Отменена</p>
                )}
              </td>
              {userrole === 'admin' && (
                <td>
                  {transaction.isdeleted ? (

                    <button onClick={() => handleRecover(index)}>Восстановить</button>
                  )
                    : null}
                </td>
              )}
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
}


export default Replenishment;
