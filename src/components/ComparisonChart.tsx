import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CalculationResult } from '../types/quote';
import { BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ComparisonChartProps {
  result: CalculationResult | null;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ result }) => {
  const { t, i18n } = useTranslation();
  const isVietnamese = i18n.language === 'vi';

  if (!result) return null;

  const labels = Array.from({ length: 25 }, (_, i) => 
    `${isVietnamese ? 'Tháng' : 'Month'} ${i}`
  );

  const purchaseData = result.purchase.cashFlow.map(cf => cf.cumulativeAmount);
  const rentalData = result.rental.cashFlow.map(cf => cf.cumulativeAmount);

  const data = {
    labels,
    datasets: [
      {
        label: t('comparison.purchase'),
        data: purchaseData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: t('comparison.rental'),
        data: rentalData,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: '500' as any
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: t('chart.cumulativeCost'),
        font: {
          size: 16,
          weight: '600' as any
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString('vi-VN') + ' VNĐ';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return (value / 1000000).toFixed(0) + 'M';
          }
        },
        title: {
          display: true,
          text: isVietnamese ? 'Chi phí (VNĐ)' : 'Cost (VND)',
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6 text-benkon-blue" />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('chart.title')}
        </h2>
      </div>
      
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ComparisonChart;