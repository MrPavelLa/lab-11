import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';

const LoansCard = ({ loanType }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [appData, setAppData] = useState([]);
  const userrole = useSelector((state) => state.role.userrole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/info');
        const data = await response.json();
        const selected = data.Loans[loanType];
        setSelectedLoan(selected);
      } catch (error) {
        console.error('Ошибка при получении данных о вкладах:', error);
      }
    };

    fetchData();
  }, [loanType]);

  const fetchApplications = async () => {
    const token = Cookies.get('jwt');
    try {
      const response = await axios.get('http://localhost:5002/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppData(response.data);
    } catch (error) {
      console.error('Error fetching application data:', error);
    }
  };

  useEffect(() => {
    if (userrole === 'admin') {
      fetchApplications();
    }
  }, [userrole]);

  return (
    <div id={loanType}>
      {selectedLoan && (
        <div className='loancard-container'>
          <Tooltip title={selectedLoan.Tooltip}>
            <img src={selectedLoan.LogoURL} alt="Logo" />
          </Tooltip>
          <div className='containerText'>
            <h2>{selectedLoan.Description}</h2>
            <p>Процентная ставка: <span style={{ fontWeight: 'bold' }}>{selectedLoan.InterestRate}% годовых</span></p>
            <p>Срок кредитования: <span style={{ fontWeight: 'bold' }}>От {selectedLoan.LoanTermsSt} до {selectedLoan.LoanTermsEnd} лет</span></p>
            <p>Минимальная сумма кредита: <span style={{ fontWeight: 'bold' }}>{selectedLoan.MinimumLoanAmount}</span></p>
            <p>Максимальная сумма кредита: <span style={{ fontWeight: 'bold' }}>{selectedLoan.MaximumLoanAmount}</span></p>
            <Modal
              description={selectedLoan.Description}
              logoURL={selectedLoan.LogoURL}
              comment={selectedLoan.Comment}
              fromLoansCard={true}
              start={selectedLoan.LoanTermsSt}
              end={selectedLoan.LoanTermsEnd}
              procent={selectedLoan.InterestRate}
              min={selectedLoan.MinimumLoanAmount}
              max={selectedLoan.MaximumLoanAmount}
            />
          </div>
        </div>
      )}

      {userrole === 'admin' && (
        <div>
          <p>Заявки</p>
          <table>
            <thead>
              <tr>
                <th>код</th>
                <th>Название</th>
                <th>Срок</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Время</th>
                <th>but</th>
                <th>but</th>
              </tr>
            </thead>
            <tbody>
              {appData.map((app) => (
                <tr key={app.code}>
                  <td>{app.code}</td>
                  <td>{app.loanName}</td>
                  <td>{app.loanTerm}</td>
                  <td>{app.amount}</td>
                  <td>{app.date}</td>
                  <td>{app.time}</td>
                  <td><button>Одобрить</button></td>
                  <td><button>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoansCard;
