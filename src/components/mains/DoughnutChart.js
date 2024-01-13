import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DoughnutChart = ({ depositAmount, calculatedAmount }) => {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    if (chartRef.current && chartInstance === null) {
      chartInstance = new Chart(chartRef.current.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Вложено', 'Начисленно'],
          datasets: [{
            data: [depositAmount, calculatedAmount],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    return () => {
      if (chartInstance !== null) {
        chartInstance.destroy();
        chartInstance = null;
      }
    };
  }, [depositAmount, calculatedAmount]);

  return <canvas ref={chartRef} width="250" height="250"></canvas>;
};

export default DoughnutChart;
