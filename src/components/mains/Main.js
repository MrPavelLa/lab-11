import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Deposits from './Deposits';
import Loans from './Loans';
import Transaction from './Transaction';
import Payments from './Payments';
import Replenishment from './Replenishment';
import Poluch from './Poluch';
import Users from './Users';

const Main = () => {
  return (
    <Routes>
      <Route path="Deposits/*" element={<Deposits />} />
      <Route path="Loans" element={<Loans />} />
      <Route path="Transaction" element={<Transaction />} />
      <Route path="Payments" element={<Payments />} />
      <Route path="Replenishment" element={<Replenishment />} />
      <Route path="Poluch" element={<Poluch />} />
      <Route path="Users" element={<Users />} />
    </Routes>
  );
};

export default Main;
