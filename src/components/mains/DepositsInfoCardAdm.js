import React, { useState, useEffect } from 'react';

const DepositsInfoCard = () => {
  const [allDeposits, setAllDeposits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/persondepositeinfo');
        const data = await response.json();
        const depositsData = Object.entries(data).map(([userCode, deposit]) => ({
          userCode,
          ...deposit,
        }));
        setAllDeposits(depositsData);
      } catch (error) {
        console.error('Ошибка при получении данных о депозитах:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <p>Депозиты</p>
      <table border="1">
        <thead>
          <tr>
            <th>Код пользователя</th>
            <th>Название депозита</th>
            <th>Сумма депозита</th>
            <th>Дата открытия</th>
            <th>Срок (в месяцах)</th>
            <th>Годовая процентная ставка</th>
            <th>Начислено</th>
            <th>Дней до окончания</th>
            <th>Изменить</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {allDeposits.map((deposit) => {
            const months = deposit.Duration === 6 ? 0.5 : deposit.Duration;
            const calculatedAmount = deposit.DepositAmount * (deposit.AnnualInterestRate / 100) * months;

            const currentDate = new Date();
            const depositDate = new Date(deposit.DepositDate);
            const diffTime = depositDate.getTime() - currentDate.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return (
              <tr key={deposit.userCode}>
                <td>{deposit.userCode}</td>
                <td>{deposit.DepositName}</td>
                <td>{deposit.DepositAmount}</td>
                <td>{deposit.DepositDate}</td>
                <td>{deposit.Duration}</td>
                <td>{deposit.AnnualInterestRate}</td>
                <td>{calculatedAmount}</td>
                <td>{daysRemaining}</td>
                <td><button>Изменить</button></td>
                <td><button>Удалить</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DepositsInfoCard;
