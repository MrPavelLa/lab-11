import React from 'react';
import LoansCard from './LoansCard';
import LoansInfoCard from './LoansInfoCard';
import { useSelector } from 'react-redux';

const Loans = () => {
  const loanTypes = ['Ипотечные', 'Потребительские', 'Автокредиты'];
  const userrole = useSelector((state) => state.role.userrole);

  return (
    <div>
      <LoansInfoCard />
      {userrole !== 'admin' ? (
        loanTypes.map((type, index) => (
          <LoansCard key={index} loanType={type} />
        ))
      ) : (
        <LoansCard loanType={'admin'} />
      )}
    </div>
  );
};

export default Loans;

