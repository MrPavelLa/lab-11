import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const Modal = ({ description, logoURL, comment, fromLoansCard, start, end, procen, min, max }) => {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(start);
  const [amount, setAmount] = useState(min);
  const usercode = useSelector((state) => state.code.usercode);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    return currentTime.toTimeString().split(' ')[0];
  };

  const addApplication = async () => {
    console.log('Adding application...');

    const date = getCurrentDate();
    const time = getCurrentTime();
    const token = Cookies.get('jwt');

    try {
      await axios.post(
        'http://localhost:5002/applications',
        {
          code: usercode,
          loanName: description,
          loanTerm: parseInt(duration),
          amount: parseInt(amount),
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Application added successfully.');
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };


  const handleDurationChange = (e) => {
    setDuration(parseInt(e.target.value));
  };

  const handleAmountChange = (e) => {
    setAmount(parseInt(e.target.value));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Подать заявку
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <div className='MadalPage'>
          <h1>{description}</h1>
          <img src={logoURL} alt="Logo" />
          <p> <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{comment}</span></p>
          {fromLoansCard && (
            <div>
              <label>Срок кредита в месяцах:</label>
              <input
                type="range"
                min={start * 12}
                max={end * 12}
                value={duration}
                onChange={handleDurationChange}
              />
              <p>{duration} месяцев</p>

              <label>Сумма кредита:</label>
              <input
                type="number"
                min={min}
                max={max}
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          )}
          <Button onClick={addApplication}>Подать заявку</Button>

        </div>
      </Dialog>
    </div>
  );
};

export default Modal;

