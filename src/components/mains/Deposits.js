import React from 'react';
import DepositsCard from './DepositsCard';
import DepositsInfoCard from './DepositsInfoCard';
import { useSelector } from 'react-redux';

const Deposits = () => {
  const depositTypes = ['Расчетные', 'Накопительные', 'Валютные'];
  const userrole = useSelector((state) => state.role.userrole);
  return (
    <div>
      <DepositsInfoCard />
      {userrole !== 'admin' ? (
        depositTypes.map((type, index) => (
          <DepositsCard key={index} depositType={type} />
        ))
      ) : (
        <DepositsCard depositType={'admin'} />
      )}
    </div>
  );
};

export default Deposits;

