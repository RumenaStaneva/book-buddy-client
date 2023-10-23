import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import 'chartjs-plugin-zoom';

interface ChartComponentProps {
  screenData: number[];
  readingData: number[];
  readingGoal: number[][];
  labels: string[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  screenData,
  readingData,
  readingGoal,
  labels,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const { dataRange } = useSelector((state: RootState) => state.readingTimeForToday);

  useEffect(() => {
    if (chartRef.current) {
      const chartConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Screen Time',
              data: screenData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Reading Time',
              data: readingData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Reading Goal',
              data: readingGoal.flat(),
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              type: 'logarithmic',
              title: {
                display: true,
                text: 'Time',
              },
              suggestedMax: Math.max(...screenData, ...readingData, ...readingGoal.flat()) * 2,
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      };

      const chart = new Chart(chartRef.current.getContext('2d') as CanvasRenderingContext2D, chartConfig);

      return () => {
        chart.destroy();
      };
    }
  }, [screenData, readingData, readingGoal, labels, dataRange]);

  return (
    <div className="chart__container">
      <div className="chart__content">
        <canvas ref={chartRef} id={`myChart ${dataRange}`} width="500" height="200"></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;

// Define RootState type for useSelector
interface RootState {
  readingTimeForToday: {
    dataRange: string;
    // Add other properties from your readingTimeForToday slice state if applicable
  };
}
