import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, PDFDownloadLink, Image } from '@react-pdf/renderer';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const Poluch = () => {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const currentDate = new Date();
  const [admincode, setAdmincode] = useState('')
  const [pcode, setpcode] = useState('')
  const usercode = useSelector((state) => state.code.usercode);
  const userrole = useSelector((state) => state.role.userrole);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchDataTransaction = async () => {
    const token = Cookies.get('jwt');
    try {
      if(admincode === 'all')
      {
        const response = await axios.get(`http://localhost:5001/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData('');
        setData(response.data);
        setpcode('=Adm'+admincode);
      }
      else{
      if (userrole === 'admin') {
        const response = await axios.get(`http://localhost:5001/transactions/${admincode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setpcode('=Adm'+admincode);
      }
      else {
        const response = await axios.get(`http://localhost:5001/transactions/${usercode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setpcode(usercode);
      }
    }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };
  const fetchUserData = async () => {
    const token = Cookies.get('jwt');
    try {
      if (userrole === 'admin') {
        const response = await axios.get(`http://localhost:5000/users/${admincode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setpcode('=Adm'+admincode);
      }
      else {
        const response = await axios.get(`http://localhost:5000/users/${usercode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setpcode(usercode);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let selectedColumnsData;
    if (admincode === 'all') {
      selectedColumnsData = data.map(({ code, operationName, date, time, amount, category, accounts, target }) => ({
        'Код': code,
        'Название операции': operationName,
        'Дата': date,
        'Время': time,
        'Сумма': amount,
        'Категория': category,
        'Счета': accounts,
        'Кому': target,
      }));
    } else {
      selectedColumnsData = data.map(({ operationName, date, time, amount, category, accounts, target }) => ({
        'Название операции': operationName,
        'Дата': date,
        'Время': time,
        'Сумма': amount,
        'Категория': category,
        'Счета': accounts,
        'Кому': target,
      }));
    }
  
    const ws = XLSX.utils.json_to_sheet(selectedColumnsData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataBlob, `transactions_${pcode}_${userData.lastName}${fileExtension}`);
  };
  

  const PDFDocument = () => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Выписка</Text>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={styles.row1}>Дата</Text>
                <Text style={styles.row2}>Время</Text>
                <Text style={styles.row3}>Сумма</Text>
                <Text style={styles.row4}>Категория</Text>
                <Text style={styles.row5}>Co счета</Text>
                <Text style={styles.row6}>На счет</Text>
                {admincode === 'all' && <Text style={styles.row7}>Код</Text>}
              </View>
              {data &&
                data.map((transaction) => (
                  <View key={transaction.id} style={styles.row}>
                    <Text style={styles.row1}> {new Date(transaction.date).toLocaleString(undefined, { month: 'numeric', day: 'numeric' })}</Text>
                    <Text style={styles.row2}>{transaction.time}</Text>
                    <Text style={styles.row3}>{transaction.amount}</Text>
                    <Text style={styles.row4}>{transaction.category}</Text>
                    <Text style={styles.row5}>{transaction.accounts}</Text>
                    <Text style={styles.row6}>{transaction.target}</Text>
                    {admincode === 'all' && <Text style={styles.row7}>{transaction.code}</Text>}
                  </View>
                ))}
            </View>
            <Text style={styles.podp}>{userData.firstName} {userData.lastName}</Text>
            <Text style={styles.podp}>{currentDate.toLocaleString()}</Text>
            <Image style={styles.image} src="logo192.png" />
          </View>
        </Page>
      </Document>
    );
  };
  
  Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      fontFamily: "Roboto",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      width: '100%',
    },
    header: {
      fontWeight: 'bold',
      fontSize: 25,
      marginBottom: 10,
    },
    podp: {
      fontSize: 14,
      textAlign: 'right',
      marginTop: 20,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      borderTop: '1px solid #EEE',
      paddingTop: 8,
      paddingBottom: 8,
    },
    transactionText: {
      fontSize: 12,
      marginBottom: 5,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 10,
      position: 'relative',
      marginLeft: '80%',
      marginRight: 30,
      transform: 'translateY(-50%)',
      zIndex: 2,
    },

    row1: {
      width: '12%',
    },
    row2: {
      width: '12%',
    },
    row3: {
      width: '11%',
    },
    row4: {
      width: '18%',
    },
    row5: {
      width: '18%',
    },
    row6: {
      width: '18%',
    },
    row7: {
      width: '12%',
    },
  });

  const exportToTxt = () => {
    const fileType = 'text/plain;charset=UTF-8';
    const fileExtension = '.txt';
  
    const headerLines = [      
      currentDate.toLocaleString(),
      `${userData.firstName} ${userData.lastName}`,
      'Operation Name\tDate\tTime\tAmount\tCategory\tAccounts\tTarget' + (admincode === 'all' ? '\tCode' : '')
    ];
  
    const txtData = headerLines.join('\n') + '\n' +
      data.map((transaction) => {
        let transactionData = `${transaction.operationName}\t${transaction.date}\t${transaction.time}\t${transaction.amount}\t${transaction.category}\t${transaction.accounts}\t${transaction.target}`;
        

        if (admincode === 'all') {
          transactionData += `\t${transaction.code}`;
        }
  
        return transactionData;
      }).join('\n');
  
    const txtBlob = new Blob([txtData], { type: fileType });
    FileSaver.saveAs(txtBlob, `transactions_${pcode}_${userData.lastName}${fileExtension}`);
  };
  

  const handleSearch = () => {
    fetchUserData();
    fetchDataTransaction();
  };
  return (
    <div className='ReplenishmentCont'>
      {userrole === 'admin' && (
        <div className='adm'>
          <input
            type="text"
            placeholder="Введите код"
            value={admincode}
            onChange={(e) => setAdmincode(e.target.value)}
          />
        </div>
      )}
      <button onClick={() => {
        {
          (userrole === 'admin') &&
          handleSearch();
        }
        fetchDataTransaction();
      }}>Load Data</button>
      {data && (
        <>
          <button onClick={() => exportToTxt()}>Export to Txt</button>
          <button onClick={() => exportToExcel()}>Export to Excel</button>
          <PDFDownloadLink document={<PDFDocument />} fileName={`transactions_${pcode}_${userData.lastName}.pdf`}>
            {({ blob, url, loading, error }) => (
              <button disabled={loading} onClick={loading ? null : () => { }}>
                {loading ? 'Loading document...' : 'Export to PDF'}
              </button>
            )}
          </PDFDownloadLink>

          <PDFViewer width="100%" height="800px">
            <PDFDocument />
          </PDFViewer>
        </>
      )}
    </div>
  );
};

export default Poluch;
