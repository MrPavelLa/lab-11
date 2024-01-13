import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TransactionChart = ({ transactions }) => {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    const getChartData = () => {
      const amounts = transactions.reduce((acc, transaction) => {
        if (transaction.category === 'пополнение' || transaction.category === 'оплата') {
          acc[transaction.category] = acc[transaction.category] ? acc[transaction.category] + transaction.amount : transaction.amount;
        }
        return acc;
      }, {});

      return {
        labels: Object.keys(amounts),
        datasets: [
          {
            label: 'Сумма',
            data: Object.values(amounts),
            backgroundColor: ['#FF6384', '#36A2EB'],
          },
        ],
      };
    };

    const renderChart = () => {
      if (chartRef.current && chartInstance === null) {
        const ctx = chartRef.current.getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'pie',
          data: getChartData(),
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    };

    renderChart();

    return () => {
      if (chartInstance !== null) {
        chartInstance.destroy();
        chartInstance = null;
      }
    };
  }, [transactions]);

  return (
    <div>
      <canvas ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
};

export default TransactionChart;
