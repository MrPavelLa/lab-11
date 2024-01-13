import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const Modal3 = () => {
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [statuss, setStatuss] = useState('');
  const [newPas, setnewPas] = useState('');
  const [newPas2, setnewPas2] = useState('');

  const handleOpen = () => {
    setOpen(true);
    setLogin('');
    setPhoneNumber('');
    setMessage('');
    setnewPas('');
    setnewPas2('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setnewPas(e.target.value);
  };
  const handlePasswordChange2 = (e) => {
    setnewPas2(e.target.value);
  };
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5003/verification/check-login', {
        login,
        phonenumber: phoneNumber,
      });
      if (response.data && response.data.status) {
        setMessage(response.data.status);
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  const handleSavePas = async () => {
    try {
      if (newPas === newPas2) {
        const response = await axios.put(`http://localhost:5003/verification/${login}`, {
          login,
          password: newPas,
        });
        if (response.data && response.data.status) {
          setStatuss(response.data.status)

        } else {
          console.error('Invalid');
        }
      }

      if (statuss === 'good') {
        alert('Данные успешно внесены');
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Забыли пароль?
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <div className='ModalLogin'>
          {message !== 'Совпадает' && (
            <div>
              <TextField
                label="Введите логин"
                variant="outlined"
                type="password"
                value={login}
                onChange={handleLoginChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Введите номер телефона"
                variant="outlined"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                fullWidth
                margin="normal"
              />
              <p>
                <span style={{ color: "red" }}>{message}</span>
              </p>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Отправить
              </Button>

            </div>
          )}

          {message === 'Совпадает' && (
            <div>
              <TextField
                label="Введите новый пароль"
                variant="outlined"
                type="password"
                value={newPas}
                onChange={handlePasswordChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Повторно"
                variant="outlined"
                type="password"
                value={newPas2}
                onChange={handlePasswordChange2}
                fullWidth
                margin="normal"
              />

              {newPas !== newPas2 && (
                <p>
                  <span style={{ color: "red" }}>Пароли не совпадают</span>
                </p>
              )}
              <Button onClick={handleSavePas} variant="contained" color="primary">
                Сохранить
              </Button>
            </div>
          )}
          <Button onClick={handleClose}>Закрыть</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Modal3;




