import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import { useSelector } from 'react-redux';
import LoansInfoCardAdm from './LoansInfoCardAdm';

const LoansInfoCard = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/personloaninfo');
        const data = await response.json();
        const selected = data[usercode];
        setSelectedLoan(selected);
      } catch (error) {
        console.error('Ошибка при получении данных о вкладе:', error);
      }
    };

    fetchData();
  }, [usercode]);

  const calculateRemainingAmount = () => {
    if (selectedLoan) {
      return selectedLoan.LoanAmount - selectedLoan.PaidOffAmount + selectedLoan.LoanAmount * (selectedLoan.LoanTerm / 12) * selectedLoan.AnnualInterestRate / 100;
    }
    return 0;
  };
  const renderBarChart = () => {
    if (selectedLoan) {
      const remainingAmount = calculateRemainingAmount();
      const data = {
        labels: ['Сумма кредита', 'Ежемесячный платеж', 'Оставшаяся сумма'],
        values: [selectedLoan.LoanAmount, selectedLoan.MonthlyPayment, remainingAmount],
      };

      return <BarChart data={data} />;
    }
    return null;
  };
  if (!selectedLoan && userrole !== 'admin') {
    return (
      <div className='loan-info'>
        <p>У вас нет кредитов</p>;
      </div>
    )
  }


  return (
    <>
      {userrole === 'user' && selectedLoan && (
        <div className='loan-info'>
          <div className='Canva'>
            {renderBarChart()}
          </div>
          <div className='dataInfo'>
            <h2>Ваши кредиты</h2>
            <p>{selectedLoan.LoanName}</p>
            <p>Процентная ставка: {selectedLoan.AnnualInterestRate}% годовых</p>
            <p>Срок кредитования: {selectedLoan.LoanTerm} месяцев</p>
            <p>Сумма кредита: ${selectedLoan.LoanAmount}</p>
            <p>Ежемесячный платеж: ${selectedLoan.MonthlyPayment}</p>
            <p>Штрафы за досрочное погашение: {selectedLoan.EarlyRepaymentPenalties}</p>
            <p>Уже погашенная сумма: ${selectedLoan.PaidOffAmount}</p>
            <p>Оставшаяся сумма: ${calculateRemainingAmount()}</p>
          </div>
        </div>
      )}
      {userrole === 'admin' && (
        <LoansInfoCardAdm />
      )}
    </>
  );

};

export default LoansInfoCard;
