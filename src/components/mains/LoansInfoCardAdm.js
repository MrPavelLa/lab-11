import React, { useState, useEffect } from 'react';

const LoansInfoCardAdm = () => {
  const [allLoans, setAllLoans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/personloaninfo');
        const data = await response.json();
        const loansData = Object.entries(data).map(([userCode, loan]) => ({
          userCode,
          ...loan,
        }));
        setAllLoans(loansData);
      } catch (error) {
        console.error('Ошибка при получении данных о депозитах:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <p>Кредиты</p>
      <table border="1">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Процентная ставка</th>
            <th>Срок кредитования</th>
            <th>Сумма кредита</th>
            <th>Ежемесячный платеж</th>
            <th>Уже погашенная сумма</th>
            <th>but</th>
            <th>but</th>
          </tr>
        </thead>
        <tbody>
          {allLoans.map((loan) => {
            return (
              <tr key={loan.userCode}>
                <td>{loan.userCode}</td>
                <td>{loan.LoanName}</td>
                <td>{loan.AnnualInterestRate}</td>
                <td>{loan.LoanTerm}</td>
                <td>{loan.LoanAmount}</td>
                <td>{loan.MonthlyPayment}</td>
                <td>{loan.PaidOffAmount}</td>
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

export default LoansInfoCardAdm;

