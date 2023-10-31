import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

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
    const convertSecondsToHHMM = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const maxSeconds = Math.max(...screenData, ...readingData, ...readingGoal.flat());
    const suggestedMaxSeconds = maxSeconds / 3600 * 1.2;

    let chart: Chart;

    const createChart = () => {
      if (chartRef.current) {
        const isXAxisVisible = window.innerWidth > 767;
        const isSmallScreen = window.innerWidth <= 767;

        const chartConfig: ChartConfiguration<'bar'> = {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: isSmallScreen ? '' : 'Screen Time',
                data: screenData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                label: isSmallScreen ? '' : 'Reading Time',
                data: readingData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
              {
                label: isSmallScreen ? '' : 'Reading Goal',
                data: readingGoal.flat(),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'category',
                min: 0,
                title: {
                  display: isXAxisVisible, // Show x-axis title only on screens wider than 767px
                  text: 'Time (hours)',
                },
                ticks: {
                  display: isXAxisVisible, // Show x-axis ticks only on screens wider than 767px
                },
              },
              y: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Time (hours)',
                },
                suggestedMax: suggestedMaxSeconds,
                ticks: {
                  stepSize: 3600,
                  callback: function (value: any) {
                    const hours = Math.round(value / 3600);
                    if (hours === 0) {
                      return `${hours}`;
                    } else if (hours === 1) {
                      return `${hours} hour`;
                    } else {
                      return `${hours} hours`;
                    }
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: 'xy',
                },
                pan: {
                  enabled: true,
                  mode: 'xy',
                },
                limits: {
                  y: { min: 0, max: maxSeconds * 1.2 },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    return `${label}: ${convertSecondsToHHMM(value)}`;
                  },
                },
              },
            },
          },
        };

        chart = new Chart(chartRef.current.getContext('2d') as CanvasRenderingContext2D, chartConfig);
      }
    };

    createChart(); // Initial chart creation

    const handleResize = () => {
      if (chart) {
        chart.destroy(); // Destroy the existing chart on resize
        createChart(); // Recreate the chart with updated options
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Remove event listener on component unmount
      if (chart) {
        chart.destroy(); // Destroy the chart when the component is unmounted
      }
    };
  }, [screenData, readingData, readingGoal, labels, dataRange]);

  return (
    <div className={`chart__container `}>
      <div className="chart__content">
        <canvas ref={chartRef} id={`myChart ${dataRange}`} width="500" height="200"></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;

interface RootState {
  readingTimeForToday: {
    dataRange: string;
  };
}
