import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Cookies from 'js-cookie';

const Modal2 = ({ operationName, id, accounts, target, amount, onTransactionUpdate }) => {
  const [open, setOpen] = useState(false);
  const [editedTarget, setEditedTarget] = useState(target);
  const [editedAmount, setEditedAmount] = useState(amount);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTargetChange = (e) => {
    setEditedTarget(e.target.value);
  };

  const handleAmountChange = (e) => {
    setEditedAmount(e.target.value);
  };

  const handleSaveChanges = async () => {
    const token = Cookies.get('jwt');
    try {
      const updatedTransaction = {
        target: editedTarget,
        amount: editedAmount
      };

      await axios.put(`http://localhost:5001/transactions/${id}`, updatedTransaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTransactionUpdate();

      handleClose();
    } catch (error) {
      console.error('Ошибка обновления операции:', error);
    }
  };


  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Изменить
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <div style={{ padding: '20px' }}>
          <p>Произведена со счета: {accounts}</p>
          <p>Имя операции: {operationName}</p>
          <TextField
            label="На какой счет"
            variant="outlined"
            value={editedTarget}
            onChange={handleTargetChange}
            fullWidth
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Сумма"
            variant="outlined"
            value={editedAmount}
            onChange={handleAmountChange}
            fullWidth
            style={{ marginBottom: '15px' }}
          />
          <Button variant="contained" onClick={handleSaveChanges}>
            Сохранить изменения
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Modal2;



