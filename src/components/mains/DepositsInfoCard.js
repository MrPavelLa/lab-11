import React, { useState, useEffect } from 'react';
import DoughnutChart from './DoughnutChart';
import { useSelector } from 'react-redux';
import DepositsInfoCardAdm from './DepositsInfoCardAdm';

const DepositsInfoCard = () => {
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [calculatedAmount, setCalculatedAmount] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/persondepositeinfo');
        const data = await response.json();
        const selected = data[usercode];
        setSelectedDeposit(selected);

        if (selected) {
          const months = selected.Duration === 6 ? 0.5 : selected.Duration;
          const calculated = selected.DepositAmount * (selected.AnnualInterestRate / 100) * months;
          setCalculatedAmount(calculated);

          const currentDate = new Date();
          const depositDate = new Date(selected.DepositDate);
          const diffTime = depositDate.getTime() - currentDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysRemaining(diffDays);
        }
      } catch (error) {
        console.error('Ошибка при получении данных о депозите:', error);
      }
    };

    fetchData();
  }, [usercode]);

  if (!selectedDeposit && userrole !== 'admin') {
    return (
      <div className='deposit-info'>
        <p>У вас нет депозитов</p>
      </div>
    );
  }


  return (
    <>
      {userrole === 'user' && (
        <div className='deposit-info'>
          <div className='Canva'>
            <DoughnutChart depositAmount={selectedDeposit.DepositAmount} calculatedAmount={calculatedAmount} />
          </div>
          <div className='dataInfo'>
            <h2>Ваши депозиты</h2>
            <p>{selectedDeposit.DepositName}</p>
            <p>Сумма вклада: {selectedDeposit.DepositAmount}</p>
            <p>Дата вклада: {selectedDeposit.DepositDate}</p>
            <p>Срок: {selectedDeposit.Duration} месяцев</p>
            <p>Процент: {selectedDeposit.AnnualInterestRate}%</p>
            <p>Начислено: {calculatedAmount}</p>
            <p>Дней до окончания: {daysRemaining}</p>
          </div>
        </div>
      )}

      {userrole === 'admin' && (
        <DepositsInfoCardAdm />
      )}
    </>
  );
};

export default DepositsInfoCard;
